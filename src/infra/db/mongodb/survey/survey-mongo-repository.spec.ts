import { Collection } from 'mongodb'
import { AddSurveyDataModel } from '../../../../domain/usecases/add-survey'
import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyMongoRepository } from './survey-mongo-repository'

describe('SurveyMongo Repository', () => {
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
  describe('add()', () => {
    test('should add a survey on success', async () => {
      const sut = makeSut()
      const accountData = makeFakeSurveyData()
      await sut.add(accountData)
      const surveysCount = await surveyCollection.countDocuments()
      expect(surveysCount).toBe(1)
    })
  })
  describe('loadAll()', () => {
    test('should load all surveys on success', async () => {
      const sut = makeSut()
      await surveyCollection.insertMany([
        makeFakeSurveyData(),
        makeFakeSurveyData()
      ])
      const surveys = await sut.loadAll()
      expect(surveys.length).toBe(2)
    })
  })
})

function makeSut (): SurveyMongoRepository {
  return new SurveyMongoRepository()
}

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
