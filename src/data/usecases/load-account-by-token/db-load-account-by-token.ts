import { LoadAccountByToken, AccountModel, Decrypter, LoadAccountByTokenRepository } from './db-load-account-by-token-protocols'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
  ) {}

  async load (token: string, role?: string): Promise<AccountModel> {
    this.decrypter.decrypt(token)
    await this.loadAccountByTokenRepository.loadByToken(token, role)
    return null
  }
}
