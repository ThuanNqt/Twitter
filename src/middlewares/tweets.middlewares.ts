import { checkSchema } from 'express-validator'
import { isEmpty } from 'lodash'
import { ObjectId } from 'mongodb'
import { MediaType, TweetAudience, TweetType, UserVerifyStatus } from '~/constants/enums'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { TWEETS_MESSAGE, USER_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import databaseService from '~/services/database.services'
import { numberEnumToArray } from '~/utils/commons'
import { validate } from '~/utils/validation'
import { Request, Response, NextFunction } from 'express'
import Tweet from '~/models/schemas/Tweet.schema'

export const createTweetValidator = validate(
  checkSchema({
    type: {
      isIn: {
        options: [numberEnumToArray(TweetType)],
        errorMessage: TWEETS_MESSAGE.INVALID_TYPE
      }
    },
    audience: {
      isIn: {
        options: [numberEnumToArray(TweetAudience)],
        errorMessage: TWEETS_MESSAGE.INVALID_AUDIENCE
      }
    },
    parent_id: {
      custom: {
        options: (value, { req }) => {
          const type = req.body.type as TweetType
          // If type is retweet, comment, quotetweet then parent_id is the tweet_id of the parent tweet
          if ([TweetType.Retweet, TweetType.Comment, TweetType.QuoteTweet].includes(type) && !ObjectId.isValid(value)) {
            throw new Error(TWEETS_MESSAGE.PARENT_ID_MUST_BE_A_VALID_TWEET_ID)
          }

          // If type is tweet then parent_id = null
          if (type === TweetType.Tweet && value !== null) {
            throw new Error(TWEETS_MESSAGE.PARENT_ID_MUST_BE_NULL)
          }
          return true
        }
      }
    },
    content: {
      custom: {
        options: (value, { req }) => {
          const type = req.body.type as TweetType
          const hashtags = req.body.hashtags as string[]
          const mentions = req.body.mentions as string[]

          // If the type is comment, qoutetweet, tweet and there are no mentions and hashtags, the content must be a non-empty string
          if (
            [TweetType.Tweet, TweetType.Comment, TweetType.QuoteTweet].includes(type) &&
            isEmpty(hashtags) &&
            isEmpty(mentions) &&
            value.trim() === ''
          ) {
            throw new Error(TWEETS_MESSAGE.CONTENT_MUST_BE_A_NON_STRING)
          }

          // If type is retweet then content must be a string empty
          if (type === TweetType.Retweet && value !== '') {
            throw new Error(TWEETS_MESSAGE.CONTENT_MUST_BE_A_STRING_EMPTY)
          }
          return true
        }
      }
    },
    hashtags: {
      isArray: true,
      custom: {
        options: (value, { req }) => {
          if (value.some((item: any) => typeof item !== 'string')) {
            throw new Error(TWEETS_MESSAGE.HASHTAGS_MUST_BE_AN_ARRAY_OF_STRING)
          }
          return true
        }
      }
    },
    mentions: {
      isArray: true,
      custom: {
        options: (value, { req }) => {
          if (value.some((item: any) => !ObjectId.isValid(item))) {
            throw new Error(TWEETS_MESSAGE.MENTIONS_MUST_BE_AN_ARRAY_OF_OBJECT_ID)
          }
          return true
        }
      }
    },
    medias: {
      isArray: true,
      custom: {
        options: (value, { req }) => {
          if (
            value.some((item: any) => typeof item.url !== 'string' || !numberEnumToArray(MediaType).includes(item.type))
          ) {
            throw new Error(TWEETS_MESSAGE.MEDIAS_MUST_BE_AN_ARRAY_OF_MEDIA_OBJECT)
          }
          return true
        }
      }
    }
  })
)

export const tweetIdValidator = validate(
  checkSchema(
    {
      tweet_id: {
        custom: {
          options: async (value, { req }) => {
            if (!ObjectId.isValid(value)) {
              throw new ErrorWithStatus({
                status: HTTP_STATUS.BAD_REQUEST,
                message: TWEETS_MESSAGE.INVALID_TWEET_ID
              })
            }

            const tweet = (
              await databaseService.tweets
                .aggregate<Tweet>([
                  {
                    $match: {
                      _id: new ObjectId(value)
                    }
                  },
                  {
                    $lookup: {
                      from: 'hashtags',
                      localField: 'hashtags',
                      foreignField: '_id',
                      as: 'hashtags'
                    }
                  },
                  {
                    $lookup: {
                      from: 'users',
                      localField: 'mentions',
                      foreignField: '_id',
                      as: 'mentions'
                    }
                  },
                  {
                    $addFields: {
                      mentions: {
                        $map: {
                          input: '$mentions',
                          as: 'mention',
                          in: {
                            _id: '$$mention._id',
                            name: '$$mention.name',
                            email: '$$mention.email',
                            username: '$$mention.username'
                          }
                        }
                      }
                    }
                  },
                  {
                    $lookup: {
                      from: 'tweets',
                      localField: '_id',
                      foreignField: 'parent_id',
                      as: 'tweet_children'
                    }
                  },
                  {
                    $lookup: {
                      from: 'bookmarks',
                      localField: '_id',
                      foreignField: 'tweet_id',
                      as: 'bookmarks'
                    }
                  },
                  {
                    $lookup: {
                      from: 'likes',
                      localField: '_id',
                      foreignField: 'tweet_id',
                      as: 'likes'
                    }
                  },
                  {
                    $addFields: {
                      bookmarks: {
                        $size: '$bookmarks'
                      },
                      likes: {
                        $size: '$likes'
                      },
                      retweet_count: {
                        $size: {
                          $filter: {
                            input: '$tweet_children',
                            as: 'item',
                            cond: {
                              $eq: ['$$item.type', TweetType.Retweet]
                            }
                          }
                        }
                      },
                      comment_count: {
                        $size: {
                          $filter: {
                            input: '$tweet_children',
                            as: 'item',
                            cond: {
                              $eq: ['$$item.type', TweetType.Comment]
                            }
                          }
                        }
                      },
                      qoutetweet_count: {
                        $size: {
                          $filter: {
                            input: '$tweet_children',
                            as: 'item',
                            cond: {
                              $eq: ['$$item.type', TweetType.QuoteTweet]
                            }
                          }
                        }
                      }
                    }
                  },
                  {
                    $project: {
                      tweet_children: 0
                    }
                  }
                ])
                .toArray()
            )[0]

            if (!tweet) {
              throw new Error(TWEETS_MESSAGE.TWEET_NOT_FOUND)
            }

            ;(req as Request).tweet = tweet

            return true
          }
        }
      }
    },
    ['params', 'body']
  )
)

export const audienceValidator = async (req: Request, res: Response, next: NextFunction) => {
  const tweet = req.tweet as Tweet
  if (tweet.audience === TweetAudience.TwitterCircle) {
    // Check to see if the user is logged in or not
    if (!req.decoded_authorization) {
      throw new ErrorWithStatus({
        status: HTTP_STATUS.UNAUTHORIZED,
        message: USER_MESSAGES.ACCESS_TOKEN_IS_REQUIRED
      })
    }

    // Check if the author's account is locked
    const author = await databaseService.users.findOne({
      _id: new ObjectId(tweet.user_id)
    })

    if (!author || author.verify === UserVerifyStatus.Baned) {
      throw new ErrorWithStatus({
        status: HTTP_STATUS.NOT_FOUND,
        message: USER_MESSAGES.USER_NOT_FOUND
      })
    }

    // check if this tweet belongs to the author's twitterCircle or not
    const { user_id } = req.decoded_authorization
    const isInTwitterCircle = author.twitter_circle.some((user_circle_id) => user_circle_id.equals(user_id))

    if (!author._id.equals(user_id) && !isInTwitterCircle) {
      throw new ErrorWithStatus({
        status: HTTP_STATUS.FORBIDDEN,
        message: TWEETS_MESSAGE.TWEET_IS_NOT_PUBLIC
      })
    }
  }
  next()
}

export const getTweetChildrenValidator = validate(
  checkSchema(
    {
      tweet_type: {
        isIn: {
          options: [numberEnumToArray(TweetType)],
          errorMessage: TWEETS_MESSAGE.INVALID_TYPE
        }
      }
    },
    ['query']
  )
)

export const paginationValidator = validate(
  checkSchema(
    {
      limit: {
        isNumeric: true,
        custom: {
          options: async (value, { req }) => {
            const num = Number(value)
            if (num < 1 || num > 100) {
              throw new Error('1 <= limit <= 100')
            }
            return true
          }
        }
      },
      page: {
        isNumeric: true,
        custom: {
          options: async (value, { req }) => {
            const num = Number(value)
            if (num < 1) {
              throw new Error('page >= 1')
            }
            return true
          }
        }
      }
    },
    ['query']
  )
)
