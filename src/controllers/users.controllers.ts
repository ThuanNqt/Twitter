import { NextFunction, Request, Response } from 'express'
import { ObjectId } from 'mongodb'
import { UserVerifyStatus } from '~/constants/enums'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { USER_MESSAGES } from '~/constants/messages'
import { LogoutReqBody, RegisterReqBody, TokenPayload } from '~/models/requests/User.requests'
import User from '~/models/schemas/User.schema'
import databaseService from '~/services/database.services'
import userService from '~/services/users.services'

export const loginController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User
    const user_id = user._id as ObjectId
    const result = await userService.login({ user_id: user_id.toString(), verify: user.verify })
    if (result) {
      res.status(200).json({
        message: USER_MESSAGES.LOGIN_SUCCESS,
        result
      })
    }
  } catch (error) {
    next(error)
  }
}

export const registerController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userService.register(req.body)
    if (result) {
      return res.status(200).json({
        message: USER_MESSAGES.REGISTER_SUCCESS,
        result
      })
    }
  } catch (error) {
    next(error)
  }
}

export const logoutController = async (req: Request, res: Response) => {
  const { refresh_token } = req.body
  const result = await userService.logout(refresh_token)
  return res.json(result)
}

export const emailVerifyController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_email_verify_token as TokenPayload

  const user = await databaseService.users.findOne({
    _id: new ObjectId(user_id)
  })

  if (!user) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      message: USER_MESSAGES.USER_NOT_FOUND
    })
  }

  // already verified
  if (user.email_verified_token === '') {
    return res.json({
      message: USER_MESSAGES.EMAIL_ALREADY_VERIFIED
    })
  }

  // verify
  const result = await userService.verifyEmail(user_id)

  return res.json({
    message: USER_MESSAGES.EMAIL_VERIFY_SUCCESS,
    result
  })
}

export const resendEmailVerifyController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })

  if (!user) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      message: USER_MESSAGES.USER_NOT_FOUND
    })
  }

  if (user.verify === UserVerifyStatus.Verified) {
    return res.json({
      message: USER_MESSAGES.EMAIL_ALREADY_VERIFIED
    })
  }

  const result = await userService.resendVerifyEmail(user_id)
  return res.json(result)
}

export const forgotPasswordController = async (req: Request, res: Response) => {
  const { _id, verify } = req.user as User
  const result = await userService.forgotPassword({ user_id: _id.toString(), verify: verify })
  return res.json(result)
}

export const verifyForgotPasswordController = async (req: Request, res: Response) => {
  res.json({
    message: USER_MESSAGES.VERIFY_FORGOT_PASSWORD_SUCCESS
  })
}

export const resetPasswordController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_forgot_password_token as TokenPayload
  const { password } = req.body
  const result = await userService.resetPassword(user_id, password)
  return res.json(result)
}

export const getProfileController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await userService.getProfile(user_id)
  return res.json({
    message: USER_MESSAGES.GET_MY_PROFILE_SUCCESS,
    result
  })
}

export const updateProfileController = async (req: Request, res: Response) => {
  return res.json({
    message: USER_MESSAGES.UPDATE_PROFILE_SUCCESS
  })
}
