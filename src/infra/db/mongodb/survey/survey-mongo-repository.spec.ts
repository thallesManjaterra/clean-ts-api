import { AddSurveyParams } from '@/domain/usecases/survey/add-survey'
import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyMongoRepository } from './survey-mongo-repository'
import mockDate from 'mockdate'

let surveyCollection: Collection
describe('Survey Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
    mockDate.set(new Date())
  })
  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
    mockDate.reset()
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
    test('should load an empty list', async () => {
      const sut = new SurveyMongoRepository()
      const surveys = await sut.loadAll()
      expect(surveys.length).toBe(0)
    })
  })
  describe('loadById()', () => {
    test('should load survey by id', async () => {
      const sut = new SurveyMongoRepository()
      const { ops: [{ _id }] } = await surveyCollection.insertOne(makeFakeSurveyData())
      const survey = await sut.loadById(_id)
      expect(survey).toBeTruthy()
      expect(survey.id).toBeTruthy()
      expect(survey).toMatchObject(makeFakeSurveyData())
    })
  })
})

function makeFakeSurveyData (): AddSurveyParams {
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
