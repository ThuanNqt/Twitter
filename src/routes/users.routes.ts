import { wrapAsync } from './../utils/handlers'
import { Router, Request, Response } from 'express'
import {
  emailVerifyController,
  loginController,
  logoutController,
  registerController
} from '~/controllers/users.controllers'
const usersRouter = Router()
import {
  accessTokenValidator,
  emailVerifyTokenValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator
} from '~/middlewares/users.middlewares'

/**
 * Description: Login user
 * Path: /login
 * Method: Post
 * Body: {email: string, password: string}
 */
usersRouter.post('/login', loginValidator, wrapAsync(loginController))

/**
 * Description: Register a new user
 * Path: /register
 * Method: Post
 * Body: {name: string, email: string, password: string, confirm_password: string, date_of_birth: Date}
 */
usersRouter.post('/register', registerValidator, wrapAsync(registerController))

/**
 * Description: Logout
 * Path: /logout
 * Method: Post
 * Header: {Authorization: Bearer <access_token>}
 * Body: { refresh_token: string}
 */
usersRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapAsync(logoutController))

/**
 * Description: Verify email when user client click on the link in email
 * Path: /verify-email
 * Method: Post
 * Body: {email_verify_token: string}
 */
usersRouter.post('/verify-email', emailVerifyTokenValidator, wrapAsync(emailVerifyController))

export default usersRouter
