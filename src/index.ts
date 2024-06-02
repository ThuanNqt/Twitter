import express from 'express'
import userRouter from './routes/users.routes'
const app = express()
const port = 3000

app.use('/users', userRouter)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log('Server is running on port ', port)
})
