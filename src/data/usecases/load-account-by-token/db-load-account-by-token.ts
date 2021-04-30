import { LoadAccountByToken, AccountModel, Decrypter } from './db-load-account-by-token-protocols'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (
    private readonly decrypter: Decrypter
  ) {}

  async load (token: string, role?: string): Promise<AccountModel> {
    this.decrypter.decrypt(token)
    return null
  }
}
