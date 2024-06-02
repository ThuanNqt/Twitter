import express from 'express'
import usersRouter from './routes/users.routes'
const app = express()
const port = 3000

// parser json to object
app.use(express.json())

app.use('/users', usersRouter)

app.listen(port, () => {
  console.log('Server is running on port ', port)
})
