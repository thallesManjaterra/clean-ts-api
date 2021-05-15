import request from 'supertest'
import app from '../config/app'

describe('Survey Result Routes', () => {
  describe('PUT /surveys/:surveyId/results', () => {
    test('should return 403 on save survey result without accessToken', async () => {
      await request(app)
        .put('/api/surveys/any_survey_id/results')
        .expect(403)
    })
  })
})
