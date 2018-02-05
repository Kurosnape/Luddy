import { Request, Response, Router, NextFunction } from 'express'
import { default as User } from '../models/User'

export const index = Router()
const options = {
  layout: 'admin/layout'
}

index.get('/', (req: Request, res: Response) => {
  res.render('admin/index', Object.assign(options, { current: 'index' }))
})

index.get('/modify-users', (req: Request, res: Response) => {
  res.render('admin/modify-users', options)
})

index.get('/find/:id', (req: Request, res: Response) => {
  User.findOne({ id: req.params.id }, (err, obj) => {
    res.send(obj)
  })
})

index.get('/destroy/:id', (req: Request, res: Response) => {
  User.remove({ id: req.params.id }, (err) => {
    if (err) {
      throw Error(err)
    }

    res.redirect('/')
  })
})
