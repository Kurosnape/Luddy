import { Request, Response } from 'express'
const config = require('../../config')

export const login = (req: Request, res: Response) => {
  if (req.user !== undefined) {
    res.redirect('/')
  } else {
    res.render('login', {
      title: `${config.server_name} v${config.server_version}`,
      description: config.server_description
    })
  }
}

export const logout = (req: Request, res: Response) => {
  req.logout()
  res.redirect('/')
}
