import { Request, Response } from 'express'
const config = require('../../config')

export const index = (req: Request, res: Response) => {
  res.render('login', {
    title: `${config.server_name} v${config.server_version}`,
    description: config.server_description
  })
}

export const kakao = (req: Request, res: Response) => {
  res.json(req)
}
