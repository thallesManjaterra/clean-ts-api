import { Collection } from 'mongodb'
import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import app from '../config/app'
import { sign } from 'jsonwebtoken'
import env from '../config/env'
import { AddSurveyDataModel } from '../../domain/usecases/add-survey'

let surveyCollection: Collection
let accountCollection: Collection
describe('Survey Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })
  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    accountCollection = await MongoHelper.getCollection('accounts')
    await surveyCollection.deleteMany({})
    await accountCollection.deleteMany({})
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  describe('POST /survey', () => {
    test('should return 403 on add survey without accessToken', async () => {
      await request(app)
        .post('/api/survey')
        .send(makeFakeSurveyRequest())
        .expect(403)
    })
    test('should return 204 on add survey with valid accessToken', async () => {
      const newAccount = makeFakeAccountData()
      newAccount.role = 'admin'
      const account = await insertFakeAccount(newAccount)
      const accessToken = await updateAndReturnAccessToken(account.id)
      await request(app)
        .post('/api/survey')
        .set('x-access-token', accessToken)
        .send(makeFakeSurveyRequest())
        .expect(204)
    })
  })
  describe('GET /surveys', () => {
    test('should return 403 on load surveys without accessToken', async () => {
      await request(app)
        .get('/api/surveys')
        .expect(403)
    })
    test('should return 200 on load surveys with valid accessToken', async () => {
      const account = await insertFakeAccount(makeFakeAccountData())
      const accessToken = await updateAndReturnAccessToken(account.id)
      await insertFakeSurveys()
      await request(app)
        .get('/api/surveys')
        .set('x-access-token', accessToken)
        .expect(200)
    })
  })
})
async function insertFakeSurveys (): Promise<void> {
  await surveyCollection.insertMany([
    makeFakeSurveyData(),
    makeFakeSurveyData()
  ])
}

async function insertFakeAccount (newAccount: any): Promise<any> {
  const { ops: [account] } = await accountCollection.insertOne(newAccount)
  return MongoHelper.formatId(account)
}

async function updateAndReturnAccessToken (id: string): Promise<string> {
  const accessToken = sign({ id }, env.jwtSecretKey)
  await accountCollection.updateOne({ _id: id }, {
    $set: {
      accessToken
    }
  })
  return accessToken
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

function makeFakeSurveyRequest (): any {
  return {
    question: 'Question',
    answers: [
      {
        image: 'http://image-name.com',
        answer: 'Answer 1'
      },
      {
        answer: 'Answer 2'
      }
    ]
  }
}

function makeFakeAccountData (): any {
  return {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'hashed_password'
  }
}
