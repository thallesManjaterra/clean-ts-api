import { Collection } from 'mongodb'
import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import app from '../config/app'
import { hash } from 'bcrypt'

let accountCollection: Collection
describe('Login Routes', () => {
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
    test('should return 200 on signup', async () => {
      await request(app)
        .post('/api/signup')
        .send(makeFakeNewAccountData())
        .expect(200)
    })
  })
  describe('POST /login', () => {
    test('should return 200 on login', async () => {
      await insertFakeAccount()
      await request(app)
        .post('/api/login')
        .send(makeFakeLoginData())
        .expect(200)
    })
    test('should return 401 on login', async () => {
      await request(app)
        .post('/api/login')
        .send(makeFakeLoginData())
        .expect(401)
    })
  })
})

const ANY_NAME = 'any_name'
const ANY_EMAIL = 'any_email@mail.com'
const ANY_PASSWORD = 'any_password'

async function insertFakeAccount (): Promise<void> {
  const salt = 12
  const hashedPassword = await hash(ANY_PASSWORD, salt)
  await accountCollection.insertOne({
    name: ANY_NAME,
    email: ANY_EMAIL,
    password: hashedPassword
  })
}

function makeFakeLoginData (): any {
  return {
    email: ANY_EMAIL,
    password: ANY_PASSWORD
  }
}

function makeFakeNewAccountData (): any {
  return {
    name: ANY_NAME,
    email: ANY_EMAIL,
    password: ANY_PASSWORD,
    passwordConfirmation: ANY_PASSWORD
  }
}
