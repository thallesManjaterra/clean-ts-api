import { AccountModel } from '@/domain/models/account'
import { mockAddAccountParams } from '@/domain/test'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { sign } from 'jsonwebtoken'
import { Collection } from 'mongodb'
import request from 'supertest'
import app from '../config/app'
import env from '../config/env'

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
      const account = await insertFakeAccount({ ...mockAddAccountParams(), role: 'admin' })
      const accessToken = makeAccessToken(account.id)
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
      const account = await insertFakeAccount(mockAddAccountParams())
      const accessToken = sign({ id: account.id }, env.jwtSecretKey)
      await updateAccountAccessToken(account.id, accessToken)
      await request(app)
        .get('/api/surveys')
        .set('x-access-token', accessToken)
        .expect(204)
    })
    test('should return 200 on load surveys with valid accessToken', async () => {
      const account = await insertFakeAccount(mockAddAccountParams())
      const accessToken = makeAccessToken(account.id)
      await updateAccountAccessToken(account.id, accessToken)
      await insertFakeSurveys()
      await request(app)
        .get('/api/surveys')
        .set('x-access-token', accessToken)
        .expect(200)
    })
  })
})

function makeAccessToken (accountId: string): string {
  const accessToken = sign({ id: accountId }, env.jwtSecretKey)
  return accessToken
}

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
  await surveyCollection.insertMany([
    makeFakeSurveyData(),
    makeFakeSurveyData()
  ])
}

function makeFakeSurveyData (): any {
  return {
    question: 'any_question',
    answers: [
      {
        answer: 'any_answer',
        image: 'http://image-name.com'
      },
      {
        answer: 'another_answer'
      }
    ]
  }
}
