import { Collection } from 'mongodb'
import { AddSurveyDataModel } from '../../../../domain/usecases/add-survey'
import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyMongoRepository } from './survey-mongo-repository'

describe('SurveyMongo Repositor', () => {
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
  test('should add a survey on success', async () => {
    const sut = new SurveyMongoRepository()
    const accountData = makeFakeSurveyData()
    await sut.add(accountData)
    const surveysCount = await surveyCollection.countDocuments()
    expect(surveysCount).toBe(1)
  })
})

function makeFakeSurveyData (): AddSurveyDataModel {
  return {
    question: 'any_question',
    answers: [
      {
        image: 'any_image',
        answer: 'any_answer'
      },
      {
        answer: 'any_answer'
      }
    ],
    date: new Date()
  }
}
