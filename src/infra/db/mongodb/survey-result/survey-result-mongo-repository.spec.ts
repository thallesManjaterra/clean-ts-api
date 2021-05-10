import { AddSurveyModel } from '@/domain/usecases/survey/add-survey'
import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyResultMongoRepository } from './survey-result-mongo-repository'
import mockDate from 'mockdate'
import { AddAccountModel } from '@/domain/usecases/account/add-account'

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
        makeFakeAccountData()
      )
      const {
        id: surveyId,
        answers: [{ answer: firstAnswer }]
      } = await insert(surveyCollection, makeFakeSurveyData())
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
        makeFakeAccountData()
      )
      const {
        id: surveyId,
        answers: [{ answer: firstAnswer }, { answer: secondAnswer }]
      } = await insert(surveyCollection, makeFakeSurveyData())
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

function makeFakeAccountData (): AddAccountModel {
  return {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'hashed_password'
  }
}

function makeFakeSurveyData (): AddSurveyModel {
  return {
    question: 'any_question',
    answers: [
      {
        image: 'any_image',
        answer: 'any_answer'
      },
      {
        answer: 'another_answer'
      }
    ],
    date: new Date()
  }
}
