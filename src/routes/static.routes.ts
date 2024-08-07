import { serveImageController, serveVideoController } from '~/controllers/static.controllers'
import { wrapAsync } from './../utils/handlers'
import { Router } from 'express'

const staticRouter = Router()

staticRouter.get('/image/:name', wrapAsync(serveImageController))
staticRouter.get('/video/:name', wrapAsync(serveVideoController))

export default staticRouter
