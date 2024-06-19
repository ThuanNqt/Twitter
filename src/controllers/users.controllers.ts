import { Request, Response } from 'express'
import userService from '~/services/users.services'

export const loginController = (req: Request, res: Response) => {
  const { email, password } = req.body
  if (email === 'thuan13112003@gmail.com' && password === '12345') {
    return res.json({
      code: 200,
      message: 'Login success'
    })
  }
  return res.json({
    code: 400,
    message: 'Login fail'
  })
}

export const registerController = async (req: Request, res: Response) => {
  const { email, password } = req.body

  try {
    const user = await userService.register({ email, password })
    if (user) {
      return res.json({
        code: 200,
        message: 'Register success'
      })
    }
  } catch (error) {
    return res.json({
      code: 400,
      message: 'Register fail'
    })
  }
}
