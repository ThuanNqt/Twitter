import { NextFunction, Request, Response } from 'express'
import { ObjectId } from 'mongodb'
import { USER_MESSAGES } from '~/constants/messages'
import User from '~/models/schemas/User.schema'
import userService from '~/services/users.services'

export const loginController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User
    const user_id = user._id as ObjectId
    const result = await userService.login(user_id.toString())
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
