import { Document, Schema, Model, model } from 'mongoose'
import * as crypto from 'crypto'
import { IUser } from '../shards/Users/IUser'

interface IUserModel extends IUser, Document {}

export const UserSchema: Schema = new Schema({
  id: String,
  email: { type: String, unique: true },

  profile: {
    username: { type: String, required: true, unique: true},
    displayName: String,
    bio: String,
    picture: String
  },
  createdAt: Date,
  lastModifiedAt: Date,
  permissionLevel: Number
}, { timestamps: true })

UserSchema.pre('save', (next) => {
  if (!this.createdAt) {
    this.createdAt = new Date()
  }

  if (!this.permissionLevel) {
    this.permissionLevel = 100
  }

  next()
})

UserSchema.methods.name = () => {
  return this.displayName || this.username
}

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
