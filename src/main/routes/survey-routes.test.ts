import request from 'supertest'
import { Collection } from 'mongodb'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import app from '../config/app'
import { AccountModel } from '../../domain/models/account'
import { sign } from 'jsonwebtoken'
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
      const accountData = makeFakeAccountData()
      accountData.role = 'admin'
      const account = await insertFakeAccount(accountData)
      const accessToken = sign({ id: account.id }, env.jwtSecretKey)
      await accountCollection.updateOne(
        { _id: account.id },
        { $set: { accessToken } }
      )
      await request(app)
        .post('/api/surveys')
        .set('x-access-token', accessToken)
        .send(makeFakeSurveyData())
        .expect(204)
    })
  })
})

async function insertFakeAccount (accountData: any): Promise<AccountModel> {
  const { ops: [account] } = await accountCollection.insertOne(accountData)
  return MongoHelper.formatId(account)
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
