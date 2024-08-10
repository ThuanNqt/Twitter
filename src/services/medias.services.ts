import { getFilenameWithoutExtension, handleUploadImage, handleUploadVideo } from '~/utils/file'
import { Request } from 'express'
import sharp from 'sharp'
import { UPLOAD_IMAGE_DIR } from '~/constants/dir'
import fs from 'fs'
import fsPromise from 'fs/promises'
import { isProduction } from '~/constants/config'
import { EncodingStatus, MediaType } from '~/constants/enums'
import { Media } from '~/models/Other'
import { encodeHLSWithMultipleVideoStreams } from '~/utils/video'
import databaseService from './database.services'
import VideoStatus from '~/models/schemas/VideoStatus.schema'

class Queue {
  items: string[]
  encoding: boolean
  constructor() {
    this.items = []
    this.encoding = false
  }

  async enqueue(item: string) {
    this.items.push(item) // item = /home/nqt/downloads/257295/257295.mp4
    const videoName = getFilenameWithoutExtension(item.split('\\').pop() as string)

    await databaseService.videoStatus.insertOne(
      new VideoStatus({
        name: videoName,
        status: EncodingStatus.Pending
      })
    )
    this.processEncode()
  }
  async processEncode() {
    if (this.encoding) return
    if (this.items.length > 0) {
      this.encoding = true
      const videoPath = this.items[0]
      const videoName = getFilenameWithoutExtension(videoPath.split('\\').pop() as string)

      await databaseService.videoStatus.updateOne(
        { name: videoName },
        {
          $set: {
            status: EncodingStatus.Processing
          },
          $currentDate: {
            updated_at: true
          }
        }
      )

      try {
        await encodeHLSWithMultipleVideoStreams(videoPath)
        this.items.shift()
        await fsPromise.unlink(videoPath)

        await databaseService.videoStatus.updateOne(
          { name: videoName },
          {
            $set: {
              status: EncodingStatus.Success
            },
            $currentDate: {
              updated_at: true
            }
          }
        )

        console.log(`Encode video ${videoPath} success`)
      } catch (error) {
        await databaseService.videoStatus
          .updateOne(
            { name: videoName },
            {
              $set: {
                status: EncodingStatus.Failed
              },
              $currentDate: {
                updated_at: true
              }
            }
          )
          .catch((err) => {
            console.error(`Update video status error`)
          })

        console.error(`Encode video ${videoPath} error`)
        console.error(error)
      }
      this.encoding = false
      this.processEncode()
    } else {
      console.log(`Encode video queue is empty`)
    }
  }
}

const queue = new Queue()

class MediasService {
  async handleUploadImageService(req: Request) {
    const files = await handleUploadImage(req)

    const result: Media[] = await Promise.all(
      files.map(async (file) => {
        const newName = getFilenameWithoutExtension(file.newFilename)

        // output file jpeg
        const newPath = UPLOAD_IMAGE_DIR + `/${newName}.jpg`

        // convert file image => jpeg
        await sharp(file.filepath).jpeg({ quality: 20 }).toFile(newPath)

        // remove cache sharp
        await sharp.cache(false)

        // delete file uploads/temp/...
        fs.unlinkSync(file.filepath)

        return {
          url: isProduction
            ? `${process.env.HOST}/static/image/${newName}.jpg`
            : `http://localhost:${process.env.PORT}/static/image/${newName}.jpg`,
          type: MediaType.Image
        }
      })
    )
    return result
  }

  async handleUploadVideoService(req: Request) {
    const files = await handleUploadVideo(req)

    const result = files.map((file) => {
      return {
        url: isProduction
          ? `${process.env.HOST}/static/video/${file.newFilename}`
          : `http://localhost:${process.env.PORT}/static/video/${file.newFilename}`,
        type: MediaType.Video
      }
    })
    return result
  }

  async handleUploadVideoHlsService(req: Request) {
    const files = await handleUploadVideo(req)

    const result: Media[] = await Promise.all(
      files.map(async (file) => {
        const newName = getFilenameWithoutExtension(file.newFilename)

        queue.enqueue(file.filepath)
        return {
          url: isProduction
            ? `${process.env.HOST}/static/video-hls/${newName}.m3u8`
            : `http://localhost:${process.env.PORT}/static/video-hls/${newName}.m3u8`,
          type: MediaType.Video
        }
      })
    )
    return result
  }

  async getVideoStatus(id: string) {
    const data = await databaseService.videoStatus.findOne({ name: id })
    return data
  }
}

const mediasService = new MediasService()
export default mediasService
