import { Request, Response } from 'express'
import { USER_MESSAGES } from '~/constants/messages'
import mediasService from '~/services/medias.services'

export const uploadImageController = async (req: Request, res: Response) => {
  const url = await mediasService.handleUploadImageService(req)
  return res.json({
    result: url,
    message: USER_MESSAGES.UPLOAD_SUCCESS
  })
}

export const uploadVideoController = async (req: Request, res: Response) => {
  const url = await mediasService.handleUploadVideoService(req)
  return res.json({
    result: url,
    message: USER_MESSAGES.UPLOAD_SUCCESS
  })
}
