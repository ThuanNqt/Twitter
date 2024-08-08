import {
  serveImageController,
  serveM3u8HlsController,
  serveVideoController,
  serveVideoStreamController,
  serveSegmentHlsController
} from '~/controllers/static.controllers'
import { Router } from 'express'

const staticRouter = Router()

staticRouter.get('/image/:name', serveImageController)
staticRouter.get('/video/:name', serveVideoController)
staticRouter.get('/video-stream/:name', serveVideoStreamController)
staticRouter.get('/video-hls/:id/master.m3u8', serveM3u8HlsController)
staticRouter.get('/video-hls/:id/:v/:segment', serveSegmentHlsController)

export default staticRouter
