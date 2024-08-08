import { wrapAsync } from './../utils/handlers'
import { Router } from 'express'
import {
  uploadImageController,
  uploadVideoController,
  uploadVideoHlsController
} from '~/controllers/medias.controllers'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'

const mediasRouter = Router()

mediasRouter.post('/upload-image', accessTokenValidator, verifiedUserValidator, wrapAsync(uploadImageController))
mediasRouter.post('/upload-video', accessTokenValidator, verifiedUserValidator, wrapAsync(uploadVideoController))
mediasRouter.post('/upload-video-hls', accessTokenValidator, verifiedUserValidator, wrapAsync(uploadVideoHlsController))

export default mediasRouter
