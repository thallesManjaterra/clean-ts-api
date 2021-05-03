import { Collection } from 'mongodb'
import { AccountModel } from '../../../../domain/models/account'
import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account-mongo-repository'

let accountCollection: Collection
describe('Account Mongo Repository', () => {
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
  describe('add()', () => {
    test('should return an account on add success', async () => {
      const sut = new AccountMongoRepository()
      const accountData = makeFakeAccountData()
      const account = await sut.add(accountData)
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account).toMatchObject(accountData)
    })
  })
  describe('loadByEmail()', () => {
    test('should return an account on loadByEmail success', async () => {
      const sut = new AccountMongoRepository()
      const fakeAccount = await insertFakeAccount(makeFakeAccountData())
      const account = await sut.loadByEmail(fakeAccount.email)
      expect(account).toBeTruthy()
      expect(account).toMatchObject(fakeAccount)
    })
    test('should return null if LoadByEmail fails', async () => {
      const sut = new AccountMongoRepository()
      const account = await sut.loadByEmail('any_email@mail.com')
      expect(account).toBe(null)
    })
  })
  describe('updateAccessToken()', () => {
    test('should update account accessToken on updateAccessToken success', async () => {
      const sut = new AccountMongoRepository()
      const fakeAccount = await insertFakeAccount(makeFakeAccountData())
      expect(fakeAccount).not.toHaveProperty('accessToken')
      const { id } = fakeAccount
      await sut.updateAccessToken(id, 'any_token')
      const account = await accountCollection.findOne({ _id: id })
      expect(account).toBeTruthy()
      expect(account).toHaveProperty('accessToken')
      expect(account.accessToken).toBe('any_token')
    })
  })
  describe('loadByToken()', () => {
    test('should return an account on loadByToken without role', async () => {
      const sut = new AccountMongoRepository()
      const fakeAccount = makeFakeAccountData()
      fakeAccount.token = 'any_token'
      await insertFakeAccount(fakeAccount)
      const account = await sut.loadByToken(fakeAccount.accessToken)
      expect(account).toBeTruthy()
      expect(account).toMatchObject(fakeAccount)
    })
    test('should return an account on loadByToken with admin role', async () => {
      const sut = new AccountMongoRepository()
      const accountData = makeFakeAccountData()
      accountData.accessToken = 'any_token'
      accountData.role = 'admin'
      await insertFakeAccount(accountData)
      const account = await sut.loadByToken('any_token', 'admin')
      expect(account).toBeTruthy()
    })
    test('should return an account on loadByToken if user is admin', async () => {
      const sut = new AccountMongoRepository()
      const accountData = makeFakeAccountData()
      accountData.accessToken = 'any_token'
      accountData.role = 'admin'
      await insertFakeAccount(accountData)
      const account = await sut.loadByToken('any_token')
      expect(account).toBeTruthy()
    })
    test('should return null if loadByToken fails', async () => {
      const sut = new AccountMongoRepository()
      const account = await sut.loadByEmail('any_token')
      expect(account).toBe(null)
    })
  })
})

async function insertFakeAccount (fakeAccountData: any): Promise<AccountModel> {
  const { ops: [account] } = await accountCollection.insertOne(fakeAccountData)
  return MongoHelper.formatId(account)
}

function makeFakeAccountData (): any {
  return {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'hashed_password'
  }
}
