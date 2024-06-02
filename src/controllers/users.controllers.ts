import { Request, Response } from 'express'

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
