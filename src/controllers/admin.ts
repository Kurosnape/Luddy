import { Request, Response } from 'express'
const config = require('../../config')
const locale = require('../../locales')

export const index = (req: Request, res: Response) => {
  res.render('admin/index', {
    title: `${locale['Login']} ─ ${config.server_name} v${config.server_version}`
  })
}
