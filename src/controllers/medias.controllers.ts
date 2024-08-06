import { Request, Response } from 'express'
import formidable from 'formidable'
import path from 'path'
import { USER_MESSAGES } from '~/constants/messages'
import mediasService from '~/services/medias.services'

export const uploadSingleImageController = async (req: Request, res: Response) => {
  const url = await mediasService.handleUploadSingleImageService(req)
  return res.json({
    result: url,
    message: USER_MESSAGES.UPLOAD_SUCCESS
  })
}
