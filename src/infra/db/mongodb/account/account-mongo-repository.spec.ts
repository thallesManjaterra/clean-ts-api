import { Collection } from 'mongodb'
import { AccountModel } from '../../../../domain/models/account'
import { AddAccountModel } from '../../../../domain/usecases/add-account'
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
  test('should return an account on add success', async () => {
    const sut = new AccountMongoRepository()
    const accountData = makeFakeAccountData()
    const account = await sut.add(accountData)
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account).toMatchObject(accountData)
  })
  test('should return an account on loadByEmail success', async () => {
    const sut = new AccountMongoRepository()
    const fakeAccount = await insertFakeAccount()
    const account = await sut.loadByEmail(fakeAccount.email)
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(fakeAccount).toMatchObject(account)
  })
  test('should return null if LoadByEmail fails', async () => {
    const sut = new AccountMongoRepository()
    const accountData = makeFakeAccountData()
    const account = await sut.loadByEmail(accountData.email)
    expect(account).toBe(null)
  })
  test('should update account accessToken on updateAccessToken success', async () => {
    const sut = new AccountMongoRepository()
    const fakeAccount = await insertFakeAccount()
    expect(fakeAccount).not.toHaveProperty('accessToken')
    const { id } = fakeAccount
    await sut.updateAccessToken(id, 'any_token')
    const account = await accountCollection.findOne({ _id: id })
    expect(account).toBeTruthy()
    expect(account).toHaveProperty('accessToken')
    expect(account.accessToken).toBe('any_token')
  })
})

async function insertFakeAccount (): Promise<AccountModel> {
  const { ops: [account] } = await accountCollection.insertOne(makeFakeAccountData())
  return MongoHelper.formatId(account)
}

function makeFakeAccountData (): AddAccountModel {
  return {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'hashed_password'
  }
}
