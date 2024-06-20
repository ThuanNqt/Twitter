import { wrapAsync } from './../utils/handlers'
import { Router, Request, Response } from 'express'
import { loginController, registerController } from '~/controllers/users.controllers'
const usersRouter = Router()
import { accessTokenValidator, loginValidator, registerValidator } from '~/middlewares/users.middlewares'

usersRouter.post('/login', loginValidator, wrapAsync(loginController))
usersRouter.post('/register', registerValidator, wrapAsync(registerController))
usersRouter.post(
  '/logout',
  accessTokenValidator,
  wrapAsync((req: any, res: any) => {
    res.json({ message: 'Logout success' })
  })
)

export default usersRouter
