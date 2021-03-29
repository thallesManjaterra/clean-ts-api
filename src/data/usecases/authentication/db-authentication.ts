import { Authentication, AuthenticationDataModel } from '../../../domain/usecases/authentication'
import { HashComparer } from '../../protocols/cryptography/hash-comparer'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  private readonly hashComparer: HashComparer
  constructor (loadAccountByEmailRepository: LoadAccountByEmailRepository, hashComparer: HashComparer) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.hashComparer = hashComparer
  }

  async auth (authenticationData: AuthenticationDataModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.load(authenticationData.email)
    if (account) {
      await this.hashComparer.compare(authenticationData.password, account.password)
    }
    return null
  }
}
