import User from '~/models/schema/User.schema'
import databaseService from './database.services'
import { RegisterReqBody } from '~/models/requests/User.requests'
import { hashPassword } from '~/utils/crypto'
import { signToken } from '~/utils/jwt'
import { TokenType } from '~/constants/enum'
import { sign } from 'crypto'

class UsersService {
  private signAccessToken(user_id: string) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.AssessToken
      },
      options: {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN
      }
    })
  }

  private signRefreshToken(user_id: string) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.RefreshToken
      },
      options: {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN
      }
    })
  }

  async register(payload: RegisterReqBody) {
    const result = await databaseService.users.insertOne(
      new User({
        ...payload, //get all data from RegisterReqBody
        day_of_birth: new Date(payload.date_of_birth), //override day_of_birth
        password: hashPassword(payload.password) //override password
      })
    )
    const user_id = result.insertedId.toHexString() //convert ObjectId to string
    //using promise.all to run 2 function at the same time, save time
    const [access_token, refresh_token] = await Promise.all([
      this.signAccessToken(user_id),
      this.signRefreshToken(user_id)
    ])
    return {
      access_token,
      refresh_token
    }
  }
  async checkEmailExist(email: string) {
    //check if this email already exists or not
    const user = await databaseService.users.findOne({ email })
    console.log(user)
    return Boolean(user) //if user exist, return true, else return false
  }
}
const usersService = new UsersService()
export default usersService
