import { DbAddAccount } from '../../../../data/usecases/add-account/db-add-account'
import { AddAccount } from '../../../../domain/usecases/add-account'
import { AccountMongoRepository } from '../../../../infra/db/mongodb/account/account-mongo-repository'
import { makeBcryptAdapter } from '../../adapters/bcrypt-adapter-factory'

export function makeDbAddAccount (): AddAccount {
  return new DbAddAccount(makeBcryptAdapter(), new AccountMongoRepository())
}
