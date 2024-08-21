import { Router } from 'express'
import { searchController } from '~/controllers/search.controllers'
import { wrapAsync } from '~/utils/handlers'

const searchRouter = Router()

/**
 * Description: Search
 * Path: /
 * Method: GET
 */
searchRouter.get('/', wrapAsync(searchController))

export default searchRouter
