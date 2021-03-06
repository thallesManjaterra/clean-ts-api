import { Authentication, LoadAccountByEmailRepository, HashComparer, Encrypter, UpdateAccessTokenRepository, AuthenticationParams } from './db-authentication-protocols'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {}

  async auth (authenticationParams: AuthenticationParams): Promise<string> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(authenticationParams.email)
    if (account) {
      const areThePasswordsEquivalents = await this.hashComparer.compare(
        authenticationParams.password,
        account.password
      )
      if (areThePasswordsEquivalents) {
        const accessToken = this.encrypter.encrypt(account.id)
        await this.updateAccessTokenRepository.updateAccessToken(account.id, accessToken)
        return accessToken
      }
    }
    return null
  }
}
