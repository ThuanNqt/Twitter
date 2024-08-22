import { searchValidator } from './../middlewares/search.middlewares'
import { Router } from 'express'
import { searchController } from '~/controllers/search.controllers'
import { paginationValidator } from '~/middlewares/tweets.middlewares'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapAsync } from '~/utils/handlers'

const searchRouter = Router()

/**
 * Description: Search
 * Path: /
 * Method: GET
 */
searchRouter.get(
  '/',
  accessTokenValidator,
  verifiedUserValidator,
  searchValidator,
  paginationValidator,
  wrapAsync(searchController)
)

export default searchRouter
