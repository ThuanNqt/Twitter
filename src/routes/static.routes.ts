import { serveImageController } from '~/controllers/static.controllers'
import { wrapAsync } from './../utils/handlers'
import { Router } from 'express'

const staticRouter = Router()

staticRouter.get('/image/:name', wrapAsync(serveImageController))

export default staticRouter
