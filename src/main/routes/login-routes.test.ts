import { Collection } from 'mongodb'
import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import app from '../config/app'
import { hash } from 'bcrypt'

describe('Login Routes', () => {
  let accountCollection: Collection
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })
  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  describe('POST /signup', () => {
    test('should return an account on signup', async () => {
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
  describe('POST /login', () => {
    test('should return 200 on login', async () => {
      const salt = 12
      const hashedPassword = await hash('any_password', salt)
      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: hashedPassword
      })
      await request(app)
        .post('/api/login')
        .send({
          email: 'any_email@mail.com',
          password: 'any_password'
        })
        .expect(200)
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
