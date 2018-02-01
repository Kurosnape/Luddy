import { Request, Response } from 'express'
const config = require('../../config')

const toJson = (obj: any) => JSON.stringify(obj)

export const index = (req: Request, res: Response) => {
  res.render('index', {
    title: `${config.server_name} v${config.server_version}`,
    description: config.server_description,
    user: toJson(req.user)
  })
}
