import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { LogMongoRepository } from './log'

describe('Log Mongo Repository', () => {
  let errorCollection: Collection
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })
  beforeEach(async () => {
    errorCollection = await MongoHelper.getCollection('errors')
    await errorCollection.deleteMany({})
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  test('should create an error log on success', async () => {
    const sut = makeSut()
    await sut.logError('any_error_stack')
    const errorCollectionCount = await errorCollection.countDocuments()
    expect(errorCollectionCount).toBe(1)
  })
})

function makeSut (): LogMongoRepository {
  return new LogMongoRepository()
}
