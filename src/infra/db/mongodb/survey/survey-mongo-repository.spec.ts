import { Collection } from 'mongodb'
import { AddSurveyModel } from '../../../../domain/usecases/add-survey'
import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyMongoRepository } from './survey-mongo-repository'

let surveyCollection: Collection
describe('Account Mongo Repository', () => {
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
  test('should add a new survey on add success', async () => {
    const sut = new SurveyMongoRepository()
    const surveyData = makeFakeSurveyData()
    await sut.add(surveyData)
    const countSurveys = await surveyCollection.countDocuments()
    expect(countSurveys).toBe(1)
    const survey = await surveyCollection.findOne({ question: surveyData.question })
    expect(survey).toBeTruthy()
  })
})

function makeFakeSurveyData (): AddSurveyModel {
  return {
    question: 'any_question',
    answers: [
      {
        image: 'any_image',
        answer: 'any_answer'
      }, {
        answer: 'another_answer'
      }
    ]
  }
}
