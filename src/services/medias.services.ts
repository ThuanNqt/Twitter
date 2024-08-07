import { getFilenameWithoutExtension, handleUploadImage } from '~/utils/file'
import { Request } from 'express'
import sharp from 'sharp'
import { UPLOAD_DIR } from '~/constants/dir'
import fs from 'fs'
import { isProduction } from '~/constants/config'
import { MediaType } from '~/constants/enums'
import { Media } from '~/models/Other'

class MediasService {
  async handleUploadImageService(req: Request) {
    const files = await handleUploadImage(req)

    const result: Media[] = await Promise.all(
      files.map(async (file) => {
        const newName = getFilenameWithoutExtension(file.newFilename)

        // output file jpeg
        const newPath = UPLOAD_DIR + `/${newName}.jpg`

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
}

const mediasService = new MediasService()
export default mediasService
