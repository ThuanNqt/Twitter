import {
  serveImageController,
  serveVideoController,
  serveVideoStreamController
} from '~/controllers/static.controllers'
import { wrapAsync } from './../utils/handlers'
import { Router } from 'express'

const staticRouter = Router()

staticRouter.get('/image/:name', serveImageController)
staticRouter.get('/video/:name', serveVideoController)
staticRouter.get('/video-stream/:name', serveVideoStreamController)

export default staticRouter
