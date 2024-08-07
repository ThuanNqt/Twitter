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
const app = express()
const port = process.env.PORT || 8000

// create folder upload
initFolder()

// parser json to object
app.use(express.json())

// database
databaseService.connect()

// routes
app.use('/users', usersRouter)
app.use('/medias', mediasRouter)
// app.use('/uploads', express.static(UPLOAD_IMAGE_DIR))
app.use('/static', staticRouter)
app.use('/static/video', express.static(UPLOAD_VIDEO_DIR))

// Default error handler
app.use(defaultErrorHandler)

app.listen(port, () => {
  console.log('Server is running on port ', port)
})
