import request from 'supertest'
import app from '../config/app'
import { sign } from 'jsonwebtoken'
import env from '../config/env'
import { AccountModel } from '@/domain/models/account'
import { Collection } from 'mongodb'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { SurveyModel } from '@/domain/models/survey'
import { AddSurveyParams } from '@/domain/usecases/survey/add-survey'
import { mockAddAccountParams } from '@/domain/test'

let accountCollection: Collection,
  surveyCollection: Collection

describe('Survey Result Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })
  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  describe('PUT /surveys/:surveyId/results', () => {
    test('should return 403 on save survey result without accessToken', async () => {
      await request(app)
        .put('/api/surveys/any_survey_id/results')
        .expect(403)
    })
    test('should return 200 on save survey result with valid accessToken', async () => {
      const account = await insertFakeAccount()
      const accessToken = makeAccessToken(account.id)
      await updateAccountAccessToken(account.id, accessToken)
      const survey = await insertFakeSurvey()
      await request(app)
        .put(`/api/surveys/${survey.id}/results`)
        .set('x-access-token', accessToken)
        .send({ answer: 'another_answer' })
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

async function insertFakeAccount (): Promise<AccountModel> {
  const { ops: [account] } = await accountCollection.insertOne(mockAddAccountParams())
  return MongoHelper.formatId(account)
}

async function insertFakeSurvey (): Promise<SurveyModel> {
  const { ops: [survey] } = await surveyCollection.insertOne(makeSurveyData())
  return MongoHelper.formatId(survey)
}

function makeAccessToken (accountId: string): string {
  const accessToken = sign({ id: accountId }, env.jwtSecretKey)
  return accessToken
}

function makeSurveyData (): AddSurveyParams {
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
    ],
    date: new Date()
  }
}
