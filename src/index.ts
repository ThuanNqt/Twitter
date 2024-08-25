import dotenv from 'dotenv'
dotenv.config()
import express, { Request, Response, NextFunction } from 'express'
import usersRouter from './routes/users.routes'
import databaseService from './services/database.services'
import { defaultErrorHandler } from './middlewares/error.middlewares'
import mediasRouter from './routes/medias.routes'
import { initFolder } from './utils/file'
import { UPLOAD_IMAGE_DIR, UPLOAD_VIDEO_DIR } from './constants/dir'
import staticRouter from './routes/static.routes'
import cors from 'cors'
import tweetsRouter from './routes/tweets.routes'
import bookmarkRouter from './routes/bookmarks.routes'
import likeRouter from './routes/likes.routes'
import searchRouter from './routes/search.routes'
import { createServer } from 'http'
import { Server } from 'socket.io'

//import '~/utils/fake'
import '~/utils/s3'
const app = express()
const port = process.env.PORT || 8000

// cors
app.use(cors())

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

// Default error handler
app.use(defaultErrorHandler)

const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000'
  }
})

io.on('connection', (socket) => {
  console.log(`${socket.id} connected!!!`)
  socket.on('disconnect', () => {
    console.log(`user ${socket.id} disconnected!`)
  })
  socket.on('hello', (arg) => {
    console.log('Server reply: ', arg)
  })
  socket.emit('hi', {
    name: 'Nguyen Quang Thuan',
    age: 21
  })
})

httpServer.listen(port, () => {
  console.log('Server is running on port ', port)
})
