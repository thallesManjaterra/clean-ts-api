import request from 'supertest'
import { Collection } from 'mongodb'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import app from '../config/app'
import { AccountModel } from '../../domain/models/account'
import { sign } from 'jsonwebtoken'
import env from '../config/env'
import { SurveyModel } from '../../domain/models/survey'

let surveyCollection: Collection
let accountCollection: Collection
describe('Survey Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })
  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  describe('POST /surveys', () => {
    test('should return 403 on add survey without accessToken', async () => {
      await request(app)
        .post('/api/surveys')
        .send(makeFakeSurveyData())
        .expect(403)
    })
    test('should return 204 on add survey with accessToken', async () => {
      const accountData = makeFakeAccountData()
      accountData.role = 'admin'
      const account = await insertFakeAccount(accountData)
      const accessToken = sign({ id: account.id }, env.jwtSecretKey)
      await updateAccountAccessToken(account.id, accessToken)
      await request(app)
        .post('/api/surveys')
        .set('x-access-token', accessToken)
        .send(makeFakeSurveyData())
        .expect(204)
    })
  })
  describe('GET /surveys', () => {
    test('should return 403 on load surveys without accessToken', async () => {
      await request(app)
        .get('/api/surveys')
        .expect(403)
    })
    test('should return 204 on load empty surveys list with valid accessToken', async () => {
      const account = await insertFakeAccount(makeFakeAccountData())
      const accessToken = sign({ id: account.id }, env.jwtSecretKey)
      await updateAccountAccessToken(account.id, accessToken)
      await request(app)
        .get('/api/surveys')
        .set('x-access-token', accessToken)
        .expect(204)
    })
    test('should return 200 on load surveys with valid accessToken', async () => {
      const account = await insertFakeAccount(makeFakeAccountData())
      const accessToken = sign({ id: account.id }, env.jwtSecretKey)
      await updateAccountAccessToken(account.id, accessToken)
      await insertFakeSurveys()
      await request(app)
        .get('/api/surveys')
        .set('x-access-token', accessToken)
        .expect(200)
    })
  })
})

async function updateAccountAccessToken (accountId: string, accessToken: string): Promise<void> {
  await accountCollection.updateOne(
    { _id: accountId },
    { $set: { accessToken } }
  )
}

async function insertFakeAccount (accountData: any): Promise<AccountModel> {
  const { ops: [account] } = await accountCollection.insertOne(accountData)
  return MongoHelper.formatId(account)
}

async function insertFakeSurveys (): Promise<void> {
  await surveyCollection.insertMany(makeFakeSurveys())
}

function makeFakeAccountData (): any {
  return {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'hashed_password'
  }
}

function makeFakeSurveyData (): any {
  return {
    question: 'Question 1',
    answers: [
      {
        answer: 'Answer 1',
        image: 'http://image-name.com'
      },
      {
        answer: 'Answer 2'
      }
    ]
  }
}

function makeFakeSurveys (): SurveyModel[] {
  return [{
    id: 'any_id',
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }],
    date: new Date()
  }, {
    id: 'another_id',
    question: 'another_question',
    answers: [{
      image: 'another_image',
      answer: 'another_answer'
    }],
    date: new Date()
  }]
}
