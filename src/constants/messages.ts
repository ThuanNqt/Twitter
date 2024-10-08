export const USER_MESSAGES = {
  VALIDATION_ERROR: 'Validation error',
  NAME_IS_REQUIRED: 'Name is required',
  NAME_MUST_BE_A_STRING: 'Name must be a string',
  NAME_LENGTH_MUST_BE_FROM_1_TO_100: 'Name length must be from 1 to 100',
  USER_NOT_FOUND: 'User not found',
  USER_NOT_VERIFIED: 'User not verified',
  EMAIL_ALREADY_EXIST: 'Email already exist',
  EMAIL_IS_REQUIRED: 'Email is required',
  EMAIL_IS_INVALID: 'Email is invalid',
  PASSWORD_IS_REQUIRED: 'Password is required',
  PASSWORD_MUST_BE_A_STRING: 'Password must be a string',
  PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50: 'Password length must be from 6 to 50',
  PASSWORD_MUST_BE_STRONG: 'Password must be strong',
  CONFIRM_PASSWORD_IS_REQUIRED: 'Confirm password is required',
  CONFIRM_PASSWORD_MUST_BE_A_STRING: 'Confirm password must be a string',
  CONFIRM_PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50: 'Confirm password length must be from 6 to 50',
  CONFIRM_PASSWORD_MUST_BE_STRONG: 'Confirm password must be strong',
  CONFIRM_PASSWORD_NOT_MATCH_PASSWORD: 'Confirm password not match password',
  LOGIN_SUCCESS: 'Login success!',
  REGISTER_SUCCESS: 'Register success!',
  ACCESS_TOKEN_IS_REQUIRED: 'Access token is required',
  REFRESH_TOKEN_IS_REQUIRED: 'Refresh token is required',
  REFRESH_TOKEN_IS_INVALID: 'Refresh token is invalid',
  REFRESH_TOKEN_DOES_NOT_EXIST: 'Refresh token does not exist',
  LOGOUT_SUCCESS: 'Logout successful',
  REFRESH_TOKEN_SUCCESS: 'Refresh token success',
  EMAIL_VERIFY_TOKEN_IS_REQUIRED: 'Email verify token is required',
  EMAIL_VERIFY_TOKEN_IS_INVALID: 'Email verify token is invalid',
  EMAIL_VERIFY_TOKEN_DOES_NOT_EXIST: 'Email verify token does not exist',
  EMAIL_ALREADY_VERIFIED: 'Email already verified',
  EMAIL_VERIFY_SUCCESS: 'Email verify success',
  RESEND_VERIFY_EMAIL_SUCCESS: 'Resend verify email success',
  CHECK_EMAIL_TO_RESET_PASSWORD: 'Check email to reset password',
  FORGOT_PASSWORD_TOKEN_IS_REQUIRED: 'Forgot password token is required',
  VERIFY_FORGOT_PASSWORD_SUCCESS: 'Verify forgot password success',
  FORGOT_PASSWORD_TOKEN_INVALID: 'Forgot password token invalid',
  RESET_PASSWORD_SUCCESS: 'Reset password success',
  GET_MY_PROFILE_SUCCESS: 'Get my profile success',
  GET_PROFILE_SUCCESS: 'Get profile success',
  UPDATE_PROFILE_SUCCESS: 'Update profile success',
  BIO_MUST_BE_A_STRING: 'Bio must be a string',
  BIO_LENGTH_MUST_BE_FROM_1_TO_200: 'Bio length must be from 1 to 200 characters',
  LOCATION_MUST_BE_A_STRING: 'Location must be a string',
  AVATAR_MUST_BE_A_STRING: 'Avatar must be a string',
  COVER_PHOTO_MUST_BE_A_STRING: 'Cover photo must be a string',
  FOLLOW_SUCCESS: 'Follow success',
  INVALID_USER_ID: 'Invalid user id',
  USER_IS_ALREADY_FOLLOWED: 'User is already followed',
  UNFOLLOWED: 'Unfollowed',
  UNFOLLOW_SUCCESS: 'Unfollow success',
  OLD_PASSWORD_NOT_MATCH: 'Old password not match',
  CHANGE_PASSWORD_SUCCESS: 'Change password success',
  GMAIL_NOT_VERIFIED: 'Gmail not verified',
  UPLOAD_SUCCESS: 'Upload success',
  GET_VIDEO_STATUS_SUCCESS: 'Get video status success'
} as const

export const TWEETS_MESSAGE = {
  INVALID_TYPE: 'Invalid type',
  INVALID_AUDIENCE: 'Invalid audience',
  PARENT_ID_MUST_BE_A_VALID_TWEET_ID: 'Parent_id must be a valid tweet id',
  PARENT_ID_MUST_BE_NULL: 'Parent_id must be null',
  CONTENT_MUST_BE_A_NON_STRING: 'Content must be a non string',
  CONTENT_MUST_BE_A_STRING_EMPTY: 'Content must be a string empty',
  HASHTAGS_MUST_BE_AN_ARRAY_OF_STRING: 'Hashtags must be an array of string',
  MENTIONS_MUST_BE_AN_ARRAY_OF_OBJECT_ID: 'Mentions must be an array of ObjectId',
  MEDIAS_MUST_BE_AN_ARRAY_OF_MEDIA_OBJECT: 'Medias must be an array of media object',
  CREATE_TWEET_SUCCESS: 'Create tweet success',
  INVALID_TWEET_ID: 'Invalid tweet id',
  TWEET_NOT_FOUND: 'Tweet not found',
  GET_TWEET_DETAIL_SUCCESS: 'Get tweet detail success',
  TWEET_IS_NOT_PUBLIC: 'Tweet is not public',
  GET_TWEET_CHILDREN_SUCCESS: 'Get tweet children success',
  GET_NEW_FEEDS_SUCCESS: 'Get new feeds success'
}

export const BOOKMARK_MESSAGE = {
  BOOKMARK_TWEET_SUCCESS: 'Bookmark tweet success',
  UN_BOOKMARK_TWEET_SUCCESS: 'UnBookmark tweet success'
}

export const LIKE_MESSAGE = {
  LIKE_TWEET_SUCCESS: 'Like tweet success',
  UN_LIKE_TWEET_SUCCESS: 'Unlike tweet success'
}

export const SEARCH_MESSAGE = {
  SEARCH_CONTENT_TWEET_SUCCESS: 'Search content tweets success',
  CONTENT_MUST_BE_A_STRING: 'Content must be a string'
}

export const CONVERSATION_MESSAGE = {
  GET_CONVERSATION_SUCCESSFULLY: 'Get conversation successfully'
}
