import { DbLoadAccountByToken } from '@/data/usecases/account/load-account-by-token/db-load-account-by-token'
import { LoadAccountByToken } from '@/domain/usecases/account/load-account-by-token'
import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repository'
import { makeJwtAdapter } from '@/main/factories/adapters/jwt-adapter-factory'

export function makeDbLoadAccountByToken (): LoadAccountByToken {
  const accountMongoRepository = new AccountMongoRepository()
  const dbLoadAccountByToken = new DbLoadAccountByToken(makeJwtAdapter(), accountMongoRepository)
  return dbLoadAccountByToken
}
