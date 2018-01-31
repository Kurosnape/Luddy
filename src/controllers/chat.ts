import { Request, Response } from 'express'

export const index = (req: Request, res: Response) => {
  res.sendFile(__dirname + '/chat.html')
}
