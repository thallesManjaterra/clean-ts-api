import { Collection } from 'mongodb'
import { AddSurveyModel } from '../../../../domain/usecases/add-survey'
import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyMongoRepository } from './survey-mongo-repository'

let surveyCollection: Collection
describe('Survey Mongo Repository', () => {
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
  describe('add()', () => {
    test('should add a new survey', async () => {
      const sut = new SurveyMongoRepository()
      const surveyData = makeFakeSurveyData()
      await sut.add(surveyData)
      const countSurveys = await surveyCollection.countDocuments()
      expect(countSurveys).toBe(1)
      const survey = await surveyCollection.findOne({ question: surveyData.question })
      expect(survey).toBeTruthy()
    })
  })
  describe('loadAll()', () => {
    test('should load all surveys', async () => {
      const sut = new SurveyMongoRepository()
      await surveyCollection.insertMany([
        makeFakeSurveyData(),
        makeFakeSurveyData()
      ])
      const surveys = await sut.loadAll()
      expect(surveys.length).toBe(2)
    })
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
    ],
    date: new Date()
  }
}
