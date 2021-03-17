import { AddAccountModel } from '../../../../domain/usecases/add-account'
import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account'

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })
  beforeEach(async () => {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  test('should return an account on success', async () => {
    const sut = new AccountMongoRepository()
    const accountData = makeFakeAccountData()
    const account = await sut.add(accountData)
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe(accountData.name)
    expect(account.email).toBe(accountData.email)
    expect(account.password).toBe(accountData.password)
  })
})

function makeFakeAccountData (): AddAccountModel {
  return {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password'
  }
}
