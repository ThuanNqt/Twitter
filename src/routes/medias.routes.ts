import { wrapAsync } from './../utils/handlers'
import { Router } from 'express'
import { uploadImageController } from '~/controllers/medias.controllers'

const mediasRouter = Router()

mediasRouter.post('/upload-image', wrapAsync(uploadImageController))

export default mediasRouter
