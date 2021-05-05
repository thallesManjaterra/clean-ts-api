import { DbAddAccount } from '@/data/usecases/account/add-account/db-add-account'
import { AddAccount } from '@/domain/usecases/add-account'
import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repository'
import { makeBcrypAdpater } from '@/main/factories/adapters/bcrypt-adapter-factory'

export function makeDbAddAccount (): AddAccount {
  const accountMongoRepository = new AccountMongoRepository()
  const dbAddAccount = new DbAddAccount(makeBcrypAdpater(), accountMongoRepository, accountMongoRepository)
  return dbAddAccount
}
