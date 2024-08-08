import { Request, Response } from 'express'
import path from 'path'
import { UPLOAD_IMAGE_DIR, UPLOAD_VIDEO_DIR } from '~/constants/dir'
import { HTTP_STATUS } from '~/constants/httpStatus'
import fs from 'fs'

export const serveImageController = (req: Request, res: Response) => {
  const { name } = req.params

  res.sendFile(path.resolve(UPLOAD_IMAGE_DIR, name), (err) => {
    if (err) {
      if (!res.headersSent) {
        res.status((err as any).status || 404).send('Not found')
      }
    }
  })
}

export const serveVideoController = (req: Request, res: Response) => {
  const { name } = req.params

  res.sendFile(path.resolve(UPLOAD_VIDEO_DIR, name), (err) => {
    if (err) {
      if (!res.headersSent) {
        res.status((err as any).status || 404).send('Not found')
      }
    }
  })
}

export const serveVideoStreamController = async (req: Request, res: Response) => {
  const range = req.headers.range

  const { name } = req.params
  const videoPath = path.resolve(UPLOAD_VIDEO_DIR, name)

  // Kiểm tra xem file có tồn tại không
  if (!fs.existsSync(videoPath)) {
    return res.status(HTTP_STATUS.NOT_FOUND).send('Video not found')
  }

  const videoSize = fs.statSync(videoPath).size

  if (!range) {
    console.log('No range header, streaming entire video')
    const headers = {
      'Content-Length': videoSize,
      'Content-Type': 'video/mp4'
    }
    res.writeHead(HTTP_STATUS.OK, headers)
    fs.createReadStream(videoPath).pipe(res)
    return
  }

  const chunkSize = 10 ** 6 // 1MB
  const start = Number(range.replace(/\D/g, ''))
  const end = Math.min(start + chunkSize, videoSize - 1)

  const contentLength = end - start + 1

  const mime = (await import('mime')).default
  const contentType = mime.getType(videoPath) || 'video/mp4'

  const headers = {
    'Content-Range': `bytes ${start}-${end}/${videoSize}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': contentLength,
    'Content-Type': contentType
  }

  res.writeHead(HTTP_STATUS.PARTIAL_CONTENT, headers)
  const videoStream = fs.createReadStream(videoPath, { start, end })
  videoStream.pipe(res)
}

export const serveM3u8HlsController = async (req: Request, res: Response) => {
  const { id } = req.params
  res.sendFile(path.resolve(UPLOAD_VIDEO_DIR, id, 'master.m3u8'), (err) => {
    if (err) {
      if (!res.headersSent) {
        res.status((err as any).status || 404).send('Not found')
      }
    }
  })
}

export const serveSegmentHlsController = async (req: Request, res: Response) => {
  const { id, v, segment } = req.params

  // segment: 0.ts, 1.ts, 2.ts ...

  res.sendFile(path.resolve(UPLOAD_VIDEO_DIR, id, v, segment), (err) => {
    if (err) {
      if (!res.headersSent) {
        res.status((err as any).status || 404).send('Not found')
      }
    }
  })
}
