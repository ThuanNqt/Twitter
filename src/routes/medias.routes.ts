import { wrapAsync } from './../utils/handlers'
import { Router } from 'express'
import {
  uploadImageController,
  uploadVideoController,
  uploadVideoHlsController,
  videoStatusController
} from '~/controllers/medias.controllers'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'

const mediasRouter = Router()

mediasRouter.post('/upload-image', accessTokenValidator, verifiedUserValidator, wrapAsync(uploadImageController))
mediasRouter.post('/upload-video', accessTokenValidator, verifiedUserValidator, wrapAsync(uploadVideoController))
mediasRouter.post('/upload-video-hls', accessTokenValidator, verifiedUserValidator, wrapAsync(uploadVideoHlsController))
mediasRouter.get('/video-status/:id', accessTokenValidator, verifiedUserValidator, wrapAsync(videoStatusController))

export default mediasRouter
