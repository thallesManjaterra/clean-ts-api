import { Authentication, LoadAccountByEmailRepository, HashComparer, Encrypter, UpdateAccessTokenRepository, AuthenticationParams } from './db-authentication-protocols'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {}

  async auth (authenticationData: AuthenticationParams): Promise<string> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(authenticationData.email)
    if (account) {
      const arePasswordsTheEquivalents = await this.hashComparer.compare(
        authenticationData.password,
        account.password
      )
      if (arePasswordsTheEquivalents) {
        const accessToken = this.encrypter.encrypt(account.id)
        await this.updateAccessTokenRepository.updateAccessToken(account.id, accessToken)
        return accessToken
      }
    }
    return null
  }
}
