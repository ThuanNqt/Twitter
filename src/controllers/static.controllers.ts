import { Request, Response } from 'express'
import path from 'path'
import { UPLOAD_IMAGE_DIR, UPLOAD_VIDEO_DIR } from '~/constants/dir'

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
