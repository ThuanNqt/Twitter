import { NextFunction, Request, Response } from 'express'
import { File } from 'formidable'
import fs from 'fs'
import path from 'path'
import { UPLOAD_TEMP_DIR } from '~/constants/dir'

export const initFolder = () => {
  const uploadFolderPath = UPLOAD_TEMP_DIR

  if (!fs.existsSync(uploadFolderPath)) {
    fs.mkdirSync(uploadFolderPath, {
      recursive: true // create folder file upload when server run
    })
  }
}

export const handleUploadSingleImage = async (req: Request) => {
  // fix es module
  const formidable = (await import('formidable')).default
  const form = formidable({
    uploadDir: UPLOAD_TEMP_DIR,
    maxFiles: 1,
    keepExtensions: true,
    maxFileSize: 3000 * 1024,
    filter: function ({ name, originalFilename, mimetype }) {
      const acceptFileImage = name === 'image' && Boolean(mimetype?.includes('image/'))

      if (!acceptFileImage) {
        form.emit('error' as any, new Error('File type is not valid') as any)
      }

      return acceptFileImage
    }
  })

  return new Promise<File>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err)
      }

      // eslint-disable-next-line no-extra-boolean-cast
      if (!Boolean(files.image)) {
        return reject(new Error('File is empty'))
      }

      resolve((files.image as File[])[0])
    })
  })
}

/* EX: hello.png => hello */
export const getFilenameWithoutExtension = (fileName: string) => {
  return fileName.split('.')[0]
}
