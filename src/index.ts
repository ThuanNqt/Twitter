import express, { Request, Response, NextFunction } from 'express'
import usersRouter from './routes/users.routes'
import databaseService from './services/database.services'
import { defaultErrorHandler } from './middlewares/error.middlewares'
import mediasRouter from './routes/medias.routes'
import { initFolder } from './utils/file'
import { UPLOAD_IMAGE_DIR, UPLOAD_VIDEO_DIR } from './constants/dir'
import staticRouter from './routes/static.routes'
import cors, { CorsOptions } from 'cors'
import tweetsRouter from './routes/tweets.routes'
import bookmarkRouter from './routes/bookmarks.routes'
import likeRouter from './routes/likes.routes'
import searchRouter from './routes/search.routes'
import { createServer } from 'http'
//import '~/utils/fake'
import '~/utils/s3'
import conversationsRouter from './routes/conversations.routes'
import initSocket from './utils/socket'
import helmet from 'helmet'
import { rateLimit } from 'express-rate-limit'
import { envConfig, isProduction } from './constants/config'

const app = express()
const port = envConfig.port
const httpServer = createServer(app)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false // Disable the `X-RateLimit-*` headers.
  // store: ... , // Redis, Memcached, etc. See below.
})

// helmet
app.use(helmet())

// limit
app.use(limiter)

// cors
const corsOptions: CorsOptions = {
  origin: isProduction ? envConfig.clientUrl : '*'
}
app.use(cors(corsOptions))

// create folder upload
initFolder()

// parser json to object
app.use(express.json())

// database
databaseService.connect().then(() => {
  databaseService.indexUsers()
  databaseService.indexRefreshToken()
  databaseService.indexVideoStatus()
  databaseService.indexFollowers()
  databaseService.indexTweets()
})

// routes
app.use('/users', usersRouter)
app.use('/medias', mediasRouter)
// app.use('/uploads', express.static(UPLOAD_IMAGE_DIR))
app.use('/static', staticRouter)
app.use('/static/video', express.static(UPLOAD_VIDEO_DIR))
app.use('/tweets', tweetsRouter)
app.use('/bookmarks', bookmarkRouter)
app.use('/likes', likeRouter)
app.use('/search', searchRouter)
app.use('/conversations', conversationsRouter)

// Default error handler
app.use(defaultErrorHandler)

// init socket
initSocket(httpServer)

httpServer.listen(port, () => {
  console.log('Server is running on port ', port)
})
