import jwt, { SignOptions } from 'jsonwebtoken'

export const signToken = ({
  payload,
  privateKey = process.env.JWT_SECRET as string,
  options = {
    algorithm: 'HS256'
  }
}: {
  payload: string | object | Buffer
  privateKey?: string
  options?: SignOptions
}) => {
  return new Promise<string>((result, reject) => {
    jwt.sign(payload, privateKey, options, (error, token) => {
      if (error) {
        throw reject(error)
      }
      result(token as string)
    })
  })
}
