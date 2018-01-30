import { Request, Response } from 'express'
const config = require('../../config')

export const index = (req: Request, res: Response) => {
  res.render('index', {
    title: `${config.server_name} v${config.server_version}`
  })
}
