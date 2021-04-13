import { DbAddAccount } from '../../../../../data/usecases/account/add-account/db-add-account'
import { AddAccount } from '../../../../../domain/usecases/add-account'
import { AccountMongoRepository } from '../../../../../infra/db/mongodb/account/account-mongo-repository'
import { makeBcryptAdapter } from '../../../adapters/bcrypt-adapter-factory'

export function makeDbAddAccount (): AddAccount {
  const accountMongoRepository = new AccountMongoRepository()
  return new DbAddAccount(makeBcryptAdapter(), accountMongoRepository, accountMongoRepository)
}
