import { Router } from 'express'
import { searchController } from '~/controllers/search.controllers'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapAsync } from '~/utils/handlers'

const searchRouter = Router()

/**
 * Description: Search
 * Path: /
 * Method: GET
 */
searchRouter.get('/', accessTokenValidator, verifiedUserValidator, wrapAsync(searchController))

export default searchRouter
