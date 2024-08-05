import { Request, Response } from 'express'
import formidable from 'formidable'
import path from 'path'
import mediasService from '~/services/medias.services'

export const uploadSingleImageController = async (req: Request, res: Response) => {
  const data = await mediasService.handleUploadSingleImageService(req)
  return res.json({
    result: data
  })
}
