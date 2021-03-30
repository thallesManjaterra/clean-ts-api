import { Authentication, LoadAccountByEmailRepository, HashComparer, Encrypter, UpdateAccessTokenRepository, AuthenticationDataModel } from './db-authentication-protocols'

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  private readonly hashComparer: HashComparer
  private readonly encrypter: Encrypter
  private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  constructor (
    loadAccountByEmailRepository: LoadAccountByEmailRepository,
    hashComparer: HashComparer,
    encrypter: Encrypter,
    updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.hashComparer = hashComparer
    this.encrypter = encrypter
    this.updateAccessTokenRepository = updateAccessTokenRepository
  }

  async auth (authenticationData: AuthenticationDataModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.load(authenticationData.email)
    if (account) {
      const arePasswordsTheSame = await this.hashComparer.compare(authenticationData.password, account.password)
      if (arePasswordsTheSame) {
        const accessToken = this.encrypter.encrypt(account.id)
        await this.updateAccessTokenRepository.updateAccessToken(account.id, accessToken)
        return accessToken
      }
    }
    return null
  }
}
