import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import usersRouter from './routes/users.routes'
import databaseService from './services/database.services'
const app = express()
const port = process.env.PORT || 8080

// parser json to object
app.use(express.json())

// database
databaseService.connect()

app.use('/users', usersRouter)

app.listen(port, () => {
  console.log('Server is running on port ', port)
})
