import { Request, Response } from 'express'
const config = require('../../config')
const locale = require('../../locales')

export const login = (req: Request, res: Response) => {
  // if logged in then redirect to root
  if (req.user !== undefined) {
    res.redirect('/')
  } else {
    res.render('login', {
      title: `${locale['Login']} ─ ${config.server_name} v${config.server_version}`
    })
  }
}

export const logout = (req: Request, res: Response) => {
  req.logout()
  res.redirect('/')
}
