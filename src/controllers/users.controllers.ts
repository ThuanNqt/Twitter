import { Request, Response } from 'express'
import User from '~/models/schema/User.schema'
import { ParamsDictionary } from 'express-serve-static-core'
import databaseService from '~/services/database.services'
import usersService from '~/services/users.services'
import { RegisterReqBody } from '~/models/requests/User.requests'

export const loginController = (req: Request, res: Response) => {
  const { email, password } = req.body
  if (email === 'thuanNumberOne@gmail.com' && password === 'maythudoanxem') {
    return res.json({ message: 'login success' })
  } else {
    return res.status(400).json({ message: 'login failed' })
  }
}

export const registerController = async (req: Request<ParamsDictionary, any, RegisterReqBody>, res: Response) => {
  const { name, email, password, confirm_password, date_of_birth } = req.body
  try {
    const result = await usersService.register({ name, email, password, confirm_password, date_of_birth })
    return res.json({
      message: 'Register success !',
      data: result
    })
  } catch (error) {
    return res.status(400).json({
      error: 'Register failed !'
    })
  }
}
