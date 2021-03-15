import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import app from '../config/app'

describe('Signup Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })
  beforeEach(async () => {
    await MongoHelper.getCollection('accounts').deleteMany({})
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  test('should return an account on success', async () => {
    await request(app)
      .post('/api/signup')
      .send(makeFakeNewAccount())
      .expect(200)
      .then(({ body: account }) => {
        expect(account).toBeTruthy()
        expect(account.id).toBeTruthy()
        expect(account.password).toBeTruthy()
        expect(account.password).not.toEqual(makeFakeNewAccount().password)
        expect(account.email).toBe(makeFakeNewAccount().email)
        expect(account.name).toBe(makeFakeNewAccount().name)
      })
  })
})

interface NewAccount {
  name: string
  email: string
  password: string
  passwordConfirmation: string
}

function makeFakeNewAccount (): NewAccount {
  return {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
}
