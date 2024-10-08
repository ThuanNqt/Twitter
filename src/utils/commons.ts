import { HTTP_STATUS } from '~/constants/httpStatus'
import { USER_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import { verifyToken } from './jwt'
import { JsonWebTokenError } from 'jsonwebtoken'
import { Request } from 'express'
import { envConfig } from '~/constants/config'

export const numberEnumToArray = (numberEnum: { [key: string]: string | number }) => {
  return Object.values(numberEnum).filter((value) => {
    return typeof value === 'number'
  })
}

export const verifyAccessTokenValidator = async (access_token: string, req?: Request) => {
  if (access_token === '') {
    throw new ErrorWithStatus({
      message: USER_MESSAGES.ACCESS_TOKEN_IS_REQUIRED,
      status: HTTP_STATUS.UNAUTHORIZED
    })
  }

  try {
    const decoded_authorization = await verifyToken({
      token: access_token,
      secretOrPublicKey: envConfig.jwtSecretAccessToken
    })

    if (req) {
      ;(req as Request).decoded_authorization = decoded_authorization
      return true
    }

    return decoded_authorization
  } catch (error) {
    throw new ErrorWithStatus({
      message: (error as JsonWebTokenError).message,
      status: HTTP_STATUS.UNAUTHORIZED
    })
  }
}
