import dotenv from 'dotenv'
dotenv.config()
import express, { Request, Response, NextFunction } from 'express'
import usersRouter from './routes/users.routes'
import databaseService from './services/database.services'
const app = express()
const port = process.env.PORT || 8000

// parser json to object
app.use(express.json())

// database
databaseService.connect()

app.use('/users', usersRouter)

// Error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.log('Error: ', err.message)
  res.status(400).json({ error: err.message })
})

app.listen(port, () => {
  console.log('Server is running on port ', port)
})
