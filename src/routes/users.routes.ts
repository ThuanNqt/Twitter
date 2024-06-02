import { Router } from 'express'
const userRouter = Router()

userRouter.use(
  (req, res, next) => {
    console.log('Time1: ', Date.now())
    next()
  },
  (req, res, next) => {
    console.log('Time2: ', Date.now())
    next()
  }
)

export default userRouter
