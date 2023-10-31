```ts
enum UsersVerifyStatus {
  Unverified,
  Verified,
  Banned
}

interface User {
  _id: ObjectId
  name: string
  email: string
  date_of_birth: Date
  password: string
  create_at: Date
  update_at: Date
}
interface RefreshToken {
  _id: ObjectId
  token: string
  created_at: Date
  user_id: ObjectId
}

interface Follower {
  _id: ObjectId
  user_id: ObjectId
  followed_user_id: ObjectId
  create_at: Date
}

interface Bookmark {
  _id: ObjectId
  user_id: ObjectId
  tweet_id: ObjectId
  created_at: Date
}

interface Like {
  _id: ObjectId
  user_id: ObjectId
  tweet_id: ObjectId
  created_at: Date
}

interface Hashtag {
  _id: ObjectId
  name: string
  create_at: Date
}
```
