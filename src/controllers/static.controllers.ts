import { Request, Response } from 'express'
import path from 'path'
import { UPLOAD_DIR } from '~/constants/dir'

export const serveImageController = async (req: Request, res: Response) => {
  const { name } = req.params

  return res.sendFile(path.resolve(UPLOAD_DIR, name), (err) => {
    if (err) {
      res.status((err as any).status).send('Not found')
    }
  })
}
