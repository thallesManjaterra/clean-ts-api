import request from 'supertest'
import app from '../config/app'

describe('Content Type Middleware', () => {
  test('should return json as default content type', async () => {
    app.get('/test_content_type', (req, res) => {
      res.send('')
    })
    await request(app)
      .get('/test_content_type')
      .expect('content-type', /json/)
  })
})
