import { Collection } from 'mongodb'
import { AddAccountModel } from '../../../../domain/usecases/add-account'
import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account-mongo-repository'

describe('Account Mongo Repository', () => {
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
  test('should return an account on add success', async () => {
    const sut = new AccountMongoRepository()
    const accountData = makeFakeAccountData()
    const account = await sut.add(accountData)
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe(accountData.name)
    expect(account.email).toBe(accountData.email)
    expect(account.password).toBe(accountData.password)
  })
  test('should return an account on loadByEmail success', async () => {
    const sut = new AccountMongoRepository()
    const accountData = makeFakeAccountData()
    await accountCollection.insertOne(accountData)
    const account = await sut.loadByEmail(accountData.email)
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe(accountData.name)
    expect(account.email).toBe(accountData.email)
    expect(account.password).toBe(accountData.password)
  })
  test('should return null if LoadByEmail fails', async () => {
    const sut = new AccountMongoRepository()
    const accountData = makeFakeAccountData()
    const account = await sut.loadByEmail(accountData.email)
    expect(account).toBe(null)
  })
  test('should update account accessToken on updateAccessToken success', async () => {
    const sut = new AccountMongoRepository()
    const accountData = makeFakeAccountData()
    const { ops: [accountWithoutToken] } = await accountCollection.insertOne(accountData)
    expect(accountWithoutToken.accessToken).toBe(undefined)
    const { _id } = accountWithoutToken
    await sut.updateAccessToken(_id, 'any_token')
    const accountWithToken = await accountCollection.findOne({ _id })
    expect(accountWithToken).toBeTruthy()
    expect(accountWithToken.accessToken).toBe('any_token')
  })
})

function makeFakeAccountData (): AddAccountModel {
  return {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password'
  }
}
