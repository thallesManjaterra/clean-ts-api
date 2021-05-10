import { DbAuthentication } from '@/data/usecases/account/authentication/db-authentication'
import { Authentication } from '@/domain/usecases/account/authentication'
import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repository'
import { makeBcrypAdpater } from '@/main/factories/adapters/bcrypt-adapter-factory'
import { makeJwtAdapter } from '@/main/factories/adapters/jwt-adapter-factory'

export function makeDbAuthentication (): Authentication {
  const accountMongoRepository = new AccountMongoRepository()
  const dbAuthentication = new DbAuthentication(accountMongoRepository, makeBcrypAdpater(), makeJwtAdapter(), accountMongoRepository)
  return dbAuthentication
}
