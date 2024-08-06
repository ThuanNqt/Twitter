import { getFilenameWithoutExtension, handleUploadSingleImage } from '~/utils/file'
import { Request } from 'express'
import sharp from 'sharp'
import { UPLOAD_DIR } from '~/constants/dir'
import fs from 'fs'

class MediasService {
  async handleUploadSingleImageService(req: Request) {
    const file = await handleUploadSingleImage(req)

    const newName = getFilenameWithoutExtension(file.newFilename)

    // output file jpeg
    const newPath = UPLOAD_DIR + `/${newName}.jpg`

    // convert file image => jpeg
    await sharp(file.filepath).jpeg({ quality: 20 }).toFile(newPath)

    // delete file uploads/temp/...
    fs.unlinkSync(file.filepath)

    return `http://localhost:8080/uploads/${newName}.jpg`
  }
}

const mediasService = new MediasService()
export default mediasService
