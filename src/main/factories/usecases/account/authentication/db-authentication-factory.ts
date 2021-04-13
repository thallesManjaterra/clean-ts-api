import { DbAuthentication } from '../../../../../data/usecases/account/authentication/db-authentication'
import { Authentication } from '../../../../../domain/usecases/authentication'
import { AccountMongoRepository } from '../../../../../infra/db/mongodb/account/account-mongo-repository'
import { makeBcryptAdapter } from '../../../adapters/bcrypt-adapter-factory'
import { makeJwtAdapter } from '../../../adapters/jwt-adapter-factory'

export function makeDbAuthentication (): Authentication {
  const accountMongoRepository = new AccountMongoRepository()
  return new DbAuthentication(accountMongoRepository, makeBcryptAdapter(), makeJwtAdapter(), accountMongoRepository)
}
