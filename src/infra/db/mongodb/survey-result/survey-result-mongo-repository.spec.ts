import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyResultMongoRepository } from './survey-result-mongo-repository'
import mockDate from 'mockdate'
import { mockAddAccountParams, mockSurveyData } from '@/domain/test'

let surveyResultCollection: Collection,
  surveyCollection: Collection,
  accountCollection: Collection
describe('Survey Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
    mockDate.set(new Date())
  })
  beforeEach(async () => {
    surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    await surveyResultCollection.deleteMany({})
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
    mockDate.reset()
  })
  describe('save()', () => {
    test('should add a new survey result if its new', async () => {
      const sut = new SurveyResultMongoRepository()
      const { id: accountId } = await insert(
        accountCollection,
        mockAddAccountParams()
      )
      const {
        id: surveyId,
        answers: [{ answer: firstAnswer }]
      } = await insert(surveyCollection, mockSurveyData())
      const surveyResult = await sut.save({
        accountId,
        surveyId,
        answer: firstAnswer,
        date: new Date()
      })
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.id).toBeTruthy()
      expect(surveyResult.answer).toBe(firstAnswer)
    })
    test('should update a survey result if its not new', async () => {
      const { id: accountId } = await insert(
        accountCollection,
        mockAddAccountParams()
      )
      const {
        id: surveyId,
        answers: [{ answer: firstAnswer }, { answer: secondAnswer }]
      } = await insert(surveyCollection, mockSurveyData())
      const surveyResult = await insert(surveyResultCollection, {
        accountId, surveyId, answer: firstAnswer, date: new Date()
      })
      const sut = new SurveyResultMongoRepository()
      const surveyResultUpdated = await sut.save({
        accountId,
        surveyId,
        answer: secondAnswer,
        date: new Date()
      })
      expect(surveyResultUpdated).toBeTruthy()
      expect(surveyResultUpdated.id).toEqual(surveyResult.id)
      expect(surveyResultUpdated.answer).toBe(secondAnswer)
    })
  })
})

async function insert (collection: Collection, data: any): Promise<any> {
  const {
    ops: [document]
  } = await collection.insertOne(data)
  return MongoHelper.formatId(document)
}
