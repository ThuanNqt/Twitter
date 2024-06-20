import dotenv from 'dotenv'
dotenv.config()
import express, { Request, Response, NextFunction } from 'express'
import usersRouter from './routes/users.routes'
import databaseService from './services/database.services'
import { defaultErrorHandler } from './middlewares/error.middlewares'
const app = express()
const port = process.env.PORT || 8000

// parser json to object
app.use(express.json())

// database
databaseService.connect()

app.use('/users', usersRouter)

// Default error handler
app.use(defaultErrorHandler)

app.listen(port, () => {
  console.log('Server is running on port ', port)
})
