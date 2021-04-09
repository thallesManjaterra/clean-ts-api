import { Collection } from 'mongodb'
import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import app from '../config/app'
import { AddSurveyDataModel } from '../../domain/usecases/add-survey'

describe('Survey Routes', () => {
  let surveyCollection: Collection
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })
  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  describe('POST /survey', () => {
    test('should return 403 on add survey without accessToken', async () => {
      await request(app)
        .post('/api/survey')
        .send(makeFakeSurvey())
        .expect(403)
    })
  })
})

function makeFakeSurvey (): AddSurveyDataModel {
  return {
    question: 'Question',
    answers: [
      {
        image: 'http://image-name.com',
        answer: 'Answer 1'
      },
      {
        answer: 'Answer 2'
      }
    ]
  }
}
