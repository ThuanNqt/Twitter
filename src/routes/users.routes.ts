import { wrapAsync } from './../utils/handlers'
import { Router, Request, Response } from 'express'
import {
  emailVerifyController,
  forgotPasswordController,
  loginController,
  logoutController,
  registerController,
  resendEmailVerifyController,
  resetPasswordController,
  verifyForgotPasswordController
} from '~/controllers/users.controllers'
const usersRouter = Router()
import {
  accessTokenValidator,
  emailVerifyTokenValidator,
  forgotPasswordValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  resetPasswordValidator,
  verifyForgotPasswordTokenValidator
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

/**
 * Description: Resend verify email
 * Path: /resend-verify-email
 * Method: Post
 * Header: {Authorization: Bearer <access-token>}
 * Body: {}
 */
usersRouter.post('/resend-verify-email', accessTokenValidator, wrapAsync(resendEmailVerifyController))

/**
 * Description: Forgot password
 * Path: /forgot-password
 * Method: Post
 * Body: {email: string}
 */
usersRouter.post('/forgot-password', forgotPasswordValidator, wrapAsync(forgotPasswordController))

/**
 * Description: Verify forgot password token
 * Path: /verify-forgot-password
 * Method: Post
 * Body: {forgot_password_token: string}
 */
usersRouter.post(
  '/verify-forgot-password',
  verifyForgotPasswordTokenValidator,
  wrapAsync(verifyForgotPasswordController)
)

/**
 * Description: Reset password
 * Path: /reset-password
 * Method: Post
 * Body: {forgot_password_token: string, password: string, confirm_password: string}
 */

usersRouter.post('/reset-password', resetPasswordValidator, wrapAsync(resetPasswordController))

export default usersRouter
