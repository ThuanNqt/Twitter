import { NextFunction, Request, Response } from 'express'
import { File } from 'formidable'
import fs from 'fs'
import path from 'path'
import { UPLOAD_IMAGE_TEMP_DIR, UPLOAD_VIDEO_DIR, UPLOAD_VIDEO_TEMP_DIR } from '~/constants/dir'

export const initFolder = () => {
  ;[UPLOAD_IMAGE_TEMP_DIR, UPLOAD_VIDEO_TEMP_DIR].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, {
        recursive: true // create folder file upload when server run
      })
    }
  })
}

export const handleUploadImage = async (req: Request) => {
  // fix es module
  const formidable = (await import('formidable')).default
  const form = formidable({
    uploadDir: UPLOAD_IMAGE_TEMP_DIR,
    maxFiles: 4,
    keepExtensions: true,
    maxFileSize: 3000 * 1024,
    maxTotalFileSize: 4 * 3000 * 1024,
    filter: function ({ name, originalFilename, mimetype }) {
      const acceptFileImage = name === 'image' && Boolean(mimetype?.includes('image/'))

      if (!acceptFileImage) {
        form.emit('error' as any, new Error('File type is not valid') as any)
      }

      return acceptFileImage
    }
  })

  return new Promise<File[]>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err)
      }

      // eslint-disable-next-line no-extra-boolean-cast
      if (!Boolean(files.image)) {
        return reject(new Error('File is empty'))
      }

      resolve(files.image as File[])
    })
  })
}

/* EX: hello.png => hello */
export const getFilenameWithoutExtension = (fileName: string) => {
  return fileName.split('.')[0]
}

/*
  Flow xử lý upload video giống youtube
  - Có 2 giai đoạn:
    + Upload video: Upload video thành công thì ta resolve về cho người dùng là thành công
    + Encode video: Khai báo thêm 1 url endpoint để check xem cái video đã encode thành công hay chưa
*/

export const handleUploadVideo = async (req: Request) => {
  // fix es module
  const formidable = (await import('formidable')).default

  // generate folder name
  const nanoId = (await import('nanoid')).nanoid
  const idName = nanoId()
  const folderPath = path.resolve(UPLOAD_VIDEO_DIR, idName)
  fs.mkdirSync(folderPath)

  const form = formidable({
    uploadDir: folderPath,
    maxFiles: 1,
    maxFileSize: 50 * 1024 * 1024, // 50MB
    filter: function ({ name, originalFilename, mimetype }) {
      const valid = name === 'video' && Boolean(mimetype?.includes('mp4') || mimetype?.includes('quicktime'))
      if (!valid) {
        form.emit('error' as any, new Error('File type is not valid') as any)
      }
      return valid
    },
    filename: function () {
      return idName
    }
  })

  return new Promise<File[]>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err)
      }

      // eslint-disable-next-line no-extra-boolean-cast
      if (!Boolean(files.video)) {
        return reject(new Error('File is empty'))
      }

      // rename file video
      const videos = files.video as File[]
      videos.forEach((video) => {
        const ext = getExtension(video.originalFilename as string)
        fs.renameSync(video.filepath, video.filepath + '.' + ext)
        video.newFilename = video.newFilename + '.' + ext
        video.filepath = video.filepath + '.' + ext
      })

      resolve(files.video as File[])
    })
  })
}

export const getExtension = (fullName: string) => {
  const nameArr = fullName.split('.')
  return nameArr[nameArr.length - 1]
}

export const getFiles = (dir: string, files: string[] = []) => {
  const fileList = fs.readdirSync(dir)
  for (const file of fileList) {
    const name = `${dir}/${file}`
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, files)
    } else {
      files.push(name)
    }
  }
  return files
}
