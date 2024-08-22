import { SearchQuery } from '~/models/requests/Search.requests'
import databaseService from './database.services'
import { ObjectId } from 'mongodb'
import { MediaType, MediaTypeQuery, PeopleFollow, TweetType } from '~/constants/enums'

class SearchService {
  async search({
    limit,
    page,
    content,
    user_id,
    media_type,
    people_follow
  }: {
    limit: number
    page: number
    content: string
    user_id: string
    media_type?: MediaTypeQuery
    people_follow?: PeopleFollow
  }) {
    const filter: any = {
      $text: {
        $search: content
      }
    }

    // search with media type: [video, image]
    if (media_type) {
      if (media_type === MediaTypeQuery.Image) {
        filter['medias.type'] = MediaType.Image
      } else if (media_type === MediaTypeQuery.Video) {
        filter['medias.type'] = {
          $in: [MediaType.Video, MediaType.HLS]
        }
      }
    }

    // search with people follow
    if (people_follow && people_follow === PeopleFollow.Following) {
      const user_id_obj = new ObjectId(user_id)

      // lấy ra danh sách id mà mình follow
      const followed_user_ids = await databaseService.followers
        .find(
          { user_id: user_id_obj },
          {
            projection: {
              followed_user_id: 1
            }
          }
        )
        .toArray()

      // chuyển danh sách đó về dạng mảng các id mà mình follow
      const ids = followed_user_ids.map((item) => new ObjectId(item.followed_user_id))
      // thêm id của chính mình vào vì mình có thể xem được feed của mình
      ids.push(user_id_obj)

      filter['user_id'] = {
        $in: ids
      }
    }

    const [tweets, total] = await Promise.all([
      databaseService.tweets
        .aggregate([
          {
            $match: filter
          },
          {
            $lookup: {
              from: 'users',
              localField: 'user_id',
              foreignField: '_id',
              as: 'user'
            }
          },
          {
            $unwind: {
              path: '$user'
            }
          },
          {
            $match: {
              $or: [
                {
                  audience: 0
                },
                {
                  $and: [
                    {
                      audience: 1
                    },
                    {
                      'user.twitter_circle': {
                        $in: [new ObjectId(user_id)]
                      }
                    }
                  ]
                }
              ]
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
              },
              views: {
                $add: ['$guest_views', '$user_views']
              }
            }
          },
          {
            $project: {
              tweet_children: 0,
              user: {
                password: 0,
                email_verified_token: 0,
                forgot_password_token: 0,
                twitter_circle: 0,
                date_of_birth: 0
              }
            }
          },
          {
            $skip: limit * (page - 1)
          },
          {
            $limit: limit
          }
        ])
        .toArray(),
      databaseService.tweets
        .aggregate([
          {
            $match: filter
          },
          {
            $lookup: {
              from: 'users',
              localField: 'user_id',
              foreignField: '_id',
              as: 'user'
            }
          },
          {
            $unwind: {
              path: '$user'
            }
          },
          {
            $match: {
              $or: [
                {
                  audience: 0
                },
                {
                  $and: [
                    {
                      audience: 1
                    },
                    {
                      'user.twitter_circle': {
                        $in: [new ObjectId(user_id)]
                      }
                    }
                  ]
                }
              ]
            }
          },
          {
            $count: 'total'
          }
        ])
        .toArray()
    ])

    // lấy ra các tweet_ids
    const tweet_ids = tweets.map((tweet) => tweet._id as ObjectId)
    const date = new Date()
    await databaseService.tweets.updateMany(
      {
        _id: {
          $in: tweet_ids
        }
      },
      {
        $inc: { user_views: 1 },
        $set: {
          updated_at: date
        }
      }
    )

    // tăng view thực tế vì update many không return về giá trị
    tweets.forEach((tweet) => {
      tweet.updated_at = date
      if (user_id) {
        ;(tweet.user_views as number) += 1
      }
    })

    return {
      tweets: tweets,
      total: total[0]?.total || 0
    }
  }
}

const searchService = new SearchService()
export default searchService
