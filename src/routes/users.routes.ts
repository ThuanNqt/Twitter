import { wrapAsync } from './../utils/handlers'
import { Router, Request, Response } from 'express'
import { loginController, logoutController, registerController } from '~/controllers/users.controllers'
const usersRouter = Router()
import {
  accessTokenValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator
} from '~/middlewares/users.middlewares'

usersRouter.post('/login', loginValidator, wrapAsync(loginController))
usersRouter.post('/register', registerValidator, wrapAsync(registerController))
usersRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapAsync(logoutController))

export default usersRouter
