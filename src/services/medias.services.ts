import { getFilenameWithoutExtension, getFiles, handleUploadImage, handleUploadVideo } from '~/utils/file'
import { Request } from 'express'
import sharp from 'sharp'
import { UPLOAD_IMAGE_DIR, UPLOAD_VIDEO_DIR } from '~/constants/dir'
import fs from 'fs'
import fsPromise from 'fs/promises'
import { envConfig, isProduction } from '~/constants/config'
import { EncodingStatus, MediaType } from '~/constants/enums'
import { Media } from '~/models/Other'
import { encodeHLSWithMultipleVideoStreams } from '~/utils/video'
import databaseService from './database.services'
import VideoStatus from '~/models/schemas/VideoStatus.schema'
import { uploadFileToS3 } from '~/utils/s3'
import path from 'path'

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

        // get all file in folder
        const files = getFiles(path.resolve(UPLOAD_VIDEO_DIR, videoName))

        // upload video-hls to S3
        await Promise.all(
          files.map(async (filePath) => {
            // filePath: C:\Users\ThuanNQT\OneDrive\Twitter\uploads\videos\-prOtnkjxDMnXmDcy4-Jb\v0\fileSequence0.ts
            // Mục đích muốn upload folder này lên s3: -prOtnkjxDMnXmDcy4-Jb
            // Chuyển đổi file path sang dạng / thì mới lưu được folder vì window nó khác macos với linux
            const fileName = 'videos-hls/' + filePath.replace(path.resolve(UPLOAD_VIDEO_DIR) + '\\', '')
            const mime = (await import('mime')).default
            return uploadFileToS3({
              filePath,
              fileName,
              contentType: mime.getType(filePath) as string
            })
          })
        )

        // delete file in local
        await Promise.all([
          fsPromise.rm(videoPath, { recursive: true, force: true }),
          fsPromise.rm(path.resolve(UPLOAD_VIDEO_DIR, videoName), { recursive: true, force: true })
        ])
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

        console.log(`Encode video ${videoPath} success ##########################`)
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

        const newFullFileName = `${newName}.jpg`

        // upload file to S3
        // const S3Result = await uploadFileToS3({
        //   fileName: 'images/' + newFullFileName,
        //   filePath: newPath,
        //   contentType: 'image/jpeg'
        // })

        // remove cache sharp
        await sharp.cache(false)

        // delete file uploads/temp/...
        //await Promise.all([fsPromise.unlink(file.filepath), fsPromise.unlink(newPath)])

        // const deleteFileTasks = []
        // if (fs.existsSync(file.filepath)) {
        //   deleteFileTasks.push(fsPromise.unlink(file.filepath))
        // }
        // if (fs.existsSync(newPath)) {
        //   deleteFileTasks.push(fsPromise.unlink(newPath))
        // }
        // await Promise.all(deleteFileTasks)

        // return {
        //   url: S3Result.Location as string,
        //   type: MediaType.Image
        // }

        return {
          url: isProduction
            ? `${envConfig.host}/static/image/${newName}.jpg`
            : `http://localhost:${envConfig.port}/static/image/${newName}.jpg`,
          type: MediaType.Image
        }
      })
    )
    return result
  }

  async handleUploadVideoService(req: Request) {
    const files = await handleUploadVideo(req)

    const result: Media[] = await Promise.all(
      files.map(async (file) => {
        // Upload file to S3
        const mime = (await import('mime')).default
        const S3Result = await uploadFileToS3({
          fileName: 'videos/' + file.newFilename,
          contentType: mime.getType(file.filepath) as string,
          filePath: file.filepath
        })

        // remove file from local
        fsPromise.unlink(file.filepath)

        return {
          url: S3Result.Location as string,
          type: MediaType.Video
        }
        // return {
        //   url: isProduction
        //     ? `${process.env.HOST}/static/video/${file.newFilename}`
        //     : `http://localhost:${process.env.PORT}/static/video/${file.newFilename}`,
        //   type: MediaType.Video
        // }
      })
    )
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
            ? `${envConfig.host}/static/video-hls/${newName}/master.m3u8`
            : `http://localhost:${envConfig.port}/static/video-hls/${newName}/master.m3u8`,
          type: MediaType.HLS
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
