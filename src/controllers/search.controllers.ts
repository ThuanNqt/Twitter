import { ParamsDictionary } from 'express-serve-static-core'
import { Request, Response } from 'express'
import { SearchQuery } from '~/models/requests/Search.requests'
import searchService from '~/services/search.services'
import { SEARCH_MESSAGE } from '~/constants/messages'

export const searchController = async (req: Request<ParamsDictionary, any, any, SearchQuery>, res: Response) => {
  const limit = Number(req.query.limit)
  const page = Number(req.query.page)
  const content = req.query.content
  const user_id = req.decoded_authorization?.user_id as string
  const media_type = req.query.media_type
  const people_follow = req.query.people_follow

  const result = await searchService.search({ limit, page, content, user_id, media_type, people_follow })

  return res.json({
    message: SEARCH_MESSAGE.SEARCH_CONTENT_TWEET_SUCCESS,
    result: {
      tweets: result.tweets,
      limit,
      page,
      total_page: Math.ceil(result.total / limit)
    }
  })
}
