import { AccountModel } from '@/domain/models/account'
import { AddAccountModel } from '@/domain/usecases/add-account'
import { AuthenticationDataModel } from '@/domain/usecases/authentication'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { hash } from 'bcrypt'
import { Collection } from 'mongodb'
import request from 'supertest'
import app from '../config/app'

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
    test('should return an account on signup', async () => {
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

const ANY_EMAIL = 'any_email@mail.com'
const ANY_PASSWORD = 'any_password'
const ANY_NAME = 'any_name'

function makeFakeLoginData (): AuthenticationDataModel {
  return {
    email: ANY_EMAIL,
    password: ANY_PASSWORD
  }
}

async function insertFakeAccount (): Promise<AccountModel> {
  const { ops: [account] } = await accountCollection.insertOne(await makeFakeAccountData())
  return MongoHelper.formatId(account)
}

async function makeFakeAccountData (): Promise<AddAccountModel> {
  return {
    name: ANY_NAME,
    email: ANY_EMAIL,
    password: await hashPassword(ANY_PASSWORD)
  }
}

async function hashPassword (password: string): Promise<string> {
  const salt = 12
  const hashedPassword = await hash(ANY_PASSWORD, salt)
  return hashedPassword
}

interface NewAccount {
  name: string
  email: string
  password: string
  passwordConfirmation: string
}

function makeFakeNewAccountData (): NewAccount {
  return {
    name: ANY_NAME,
    email: ANY_EMAIL,
    password: ANY_PASSWORD,
    passwordConfirmation: ANY_PASSWORD
  }
}
