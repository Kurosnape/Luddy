import { Request, Response } from 'express'
import { User } from '../models/user'

const user = new User({ email: 'im@kurosnape.co.kr' })

export const index = (req: Request, res: Response) => {
  res.json(user.toObject())
}
