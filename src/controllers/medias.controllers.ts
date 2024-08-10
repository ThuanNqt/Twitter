import { Request, Response } from 'express'
import { result } from 'lodash'
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

export const uploadVideoHlsController = async (req: Request, res: Response) => {
  const url = await mediasService.handleUploadVideoHlsService(req)
  return res.json({
    result: url,
    message: USER_MESSAGES.UPLOAD_SUCCESS
  })
}

export const videoStatusController = async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await mediasService.getVideoStatus(id)
  return res.json({
    message: USER_MESSAGES.GET_VIDEO_STATUS_SUCCESS,
    result: result
  })
}
