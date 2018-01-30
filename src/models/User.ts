import { Document, Schema, Model, model } from 'mongoose'
import { IUser } from '../shards/Users/IUser'

interface IUserModel extends IUser, Document {

}

export let UserSchema: Schema = new Schema({
  username: {
    required: true,
    type: String
  },
  email: {
    required: true,
    type: String
  },
  createdAt: {
    required: true,
    type: Date
  },
  lastModifiedAt: {
    required: true,
    type: Date
  },
  permissionLevel: {
    required: true,
    type: Number
  }
})

UserSchema.pre('save', (next) => {
  if (!this.createdAt) {
    this.createdAt = new Date()
  }

  if (!this.permissionLevel) {
    this.permissionLevel = 100
  }

  next()
})

export const User: Model<IUserModel> = model<IUserModel>('User', UserSchema)
