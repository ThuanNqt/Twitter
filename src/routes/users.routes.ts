import {
  changePasswordValidator,
  followValidator,
  unfollowValidator,
  updateProfileValidator,
  verifiedUserValidator
} from './../middlewares/users.middlewares'
import { wrapAsync } from './../utils/handlers'
import { Router, Request, Response } from 'express'
import {
  changePasswordController,
  emailVerifyController,
  followController,
  forgotPasswordController,
  getProfileController,
  getProfileOtherController,
  loginController,
  loginWithGoogle,
  logoutController,
  refreshTokenController,
  registerController,
  resendEmailVerifyController,
  resetPasswordController,
  unfollowController,
  updateProfileController,
  verifyForgotPasswordController
} from '~/controllers/users.controllers'
import { filterMiddleware } from '~/middlewares/common.middlewares'
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
import { UpdateProfileReqBody } from '~/models/requests/User.requests'

/**
 * Description: Login user
 * Path: /login
 * Method: Post
 * Body: {email: string, password: string}
 */
usersRouter.post('/login', loginValidator, wrapAsync(loginController))

/**
 * Description: Login with Google
 * Path: /oauth/google
 * Method: Post
 * Body: {email: string, password: string}
 */
usersRouter.get('/oauth/google', wrapAsync(loginWithGoogle))

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
 * Description: When the access token expires, the client sends a request
 *              with the old refresh token to renew the access token and refresh token
 * Path: /refresh-token
 * Method: POST
 * Body: {refresh_token: string}
 */
usersRouter.post('/refresh-token', refreshTokenValidator, wrapAsync(refreshTokenController))

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

/**
 * Description: Get my profile
 * Path: /me
 * Method: Get
 * Header: {Authorization: Bearer <access_token>}
 */

usersRouter.get('/me', accessTokenValidator, wrapAsync(getProfileController))

/**
 * Description: Get profile user
 * Path: /:username
 * Method: Get
 * Header: {Authorization: Bearer <access_token>}
 */

usersRouter.get('/:username', wrapAsync(getProfileOtherController))

/**
 * Description: Update my profile
 * Path: /me
 * Method: Patch
 * Header: {Authorization: Bearer <access_token>}
 * Body: UserSchema
 */

usersRouter.patch(
  '/me',
  accessTokenValidator,
  verifiedUserValidator,
  updateProfileValidator,
  filterMiddleware<UpdateProfileReqBody>(['name', 'date_of_birth', 'bio', 'location', 'avatar', 'cover_photo']),
  wrapAsync(updateProfileController)
)

/**
 * Description: Follow someone
 * Path: /follow
 * Method: Post
 * Header: {Authorization: Bearer <access_token>}
 * Body: {followed_user_id: string}
 */

usersRouter.post('/follow', accessTokenValidator, verifiedUserValidator, followValidator, wrapAsync(followController))

/**
 * Description: Cancel follow someone
 * Path: /follow/:user_id
 * Method: Delete
 * Header: {Authorization: Bearer <access_token>}
 */

usersRouter.delete(
  '/follow/:user_id',
  accessTokenValidator,
  verifiedUserValidator,
  unfollowValidator,
  wrapAsync(unfollowController)
)

/**
 * Description: Change password
 * Path: /change-password
 * Method: Put
 * Header: {Authorization: Bearer <access_token>}
 * Body: {old_password: string, password: string, confirm_password: string}
 */

usersRouter.put(
  '/change-password',
  accessTokenValidator,
  verifiedUserValidator,
  changePasswordValidator,
  wrapAsync(changePasswordController)
)

export default usersRouter
