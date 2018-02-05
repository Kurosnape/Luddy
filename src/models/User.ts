import { Document, Schema, Model, model } from 'mongoose'
import * as crypto from 'crypto'
import { IUser } from '../shards/Users/IUser'

interface IUserModel extends IUser, Document {}

export const UserSchema: Schema = new Schema({
  provider: String,
  email: { type: String },
  id: String,
  accessToken: String,
  displayName: String,

  profile: {
    bio: String,
    picture: String
  },
  createdAt: Date,
  lastModifiedAt: Date,
  permissionLevel: String
}, { timestamps: true })

UserSchema.pre('save', (next) => {
  const _now = new Date()
  this.createdAt = this.lastModifiedAt = _now
  this.profilo.bio = `${_now}에 생성된 계정입니다.`
  this.permissionLevel = 100

  next()
})

UserSchema.methods.gravatar = (size: number) => {
  if (!size) {
    size = 200
  }

  if (!this.email) {
    return `https://gravatar.com/avatar/?s=${size}&d=retro`
  }

  const md5 = crypto.createHash('md5').update(this.email).digest('hex')
  return `https://gravatar.com/avatar/${md5}?s=${size}&d=retro`
}

const User: Model<IUserModel> = model<IUserModel>('User', UserSchema)
export default User
