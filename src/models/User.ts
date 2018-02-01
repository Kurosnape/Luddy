import { Document, Schema, Model, model } from 'mongoose'
import { IUser } from '../shards/Users/IUser'

interface IUserModel extends IUser, Document {

}

export type AuthToken = {
  accessToken: string,
  kind: string
}

export const UserSchema: Schema = new Schema({
  email: { type: String, unique: true },
  password: String,
  passwordResetToken: String,
  passwordResetExpires: Date,

  naver: String,
  kakao: String,
  facebook: String,
  twitter: String,
  google: String,
  tokens: Array,

  profile: {
    name: String,
    gender: String,
    picture: String
  },
  createdAt: Date,
  lastModifiedAt: Date,
  permissionLevel: Number
}, { timestamps: true })

UserSchema.pre('save', (next) => {
  const user = this

  if (!user.createdAt) {
    user.createdAt = new Date()
  }

  if (!user.permissionLevel) {
    user.permissionLevel = 100
  }

  if (!user.isModified('password')) {
    return next()
  }

  next()
})

const User: Model<IUserModel> = model<IUserModel>('User', UserSchema)

export default User
