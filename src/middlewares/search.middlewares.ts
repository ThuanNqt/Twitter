import { checkSchema } from 'express-validator'
import { MediaTypeQuery, PeopleFollow } from '~/constants/enums'
import { SEARCH_MESSAGE } from '~/constants/messages'
import { validate } from '~/utils/validation'

export const searchValidator = validate(
  checkSchema(
    {
      content: {
        isString: {
          errorMessage: SEARCH_MESSAGE.CONTENT_MUST_BE_A_STRING
        }
      },
      media_type: {
        optional: true,
        isIn: {
          options: [Object.values(MediaTypeQuery)]
        },
        errorMessage: `Media type must be one of ${Object.values(MediaTypeQuery).join(', ')}`
      },
      people_follow: {
        optional: true,
        isIn: {
          options: [Object.values(PeopleFollow)]
        },
        errorMessage: `People follow must be one of 0 or 1`
      }
    },
    ['query']
  )
)
