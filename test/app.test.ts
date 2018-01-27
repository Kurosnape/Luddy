import { expect } from 'chai'
import * as request from 'supertest'
import app from '../src/app'

describe('app.test', () => {
  const req = request(app)

  it('GET /', async () => {
    const res = await req.get('/').expect(200)
    expect(res.text).to.equal('Hello, World!')
  })
})
