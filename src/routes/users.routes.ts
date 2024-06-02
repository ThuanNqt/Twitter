import { Router, Request, Response } from 'express'
import { loginController } from '~/controllers/users.controllers'
const usersRouter = Router()
import { loginValidator } from '~/middlewares/users.middlewares'

usersRouter.post('/login', loginValidator, loginController)

export default usersRouter
