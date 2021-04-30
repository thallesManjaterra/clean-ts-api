import { Decrypter } from './db-load-account-by-token-protocols'
import { DbLoadAccountByToken } from './db-load-account-by-token'

describe('DbLoadAccountByToken Usecase', () => {
  test('should call Decrypter with correct value', async () => {
    const { sut, decrypterStub } = makeSut()
    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')
    await sut.load('any_token', 'admin')
    expect(decryptSpy).toHaveBeenCalledWith('any_token')
  })
  test('should return null if Decrypter returns null', async () => {
    const { sut, decrypterStub } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt').mockReturnValueOnce(null)
    const account = await sut.load('any_token', 'admin')
    expect(account).toBeNull()
  })
})

interface SutTypes {
  sut: DbLoadAccountByToken
  decrypterStub: Decrypter
}

function makeSut (): SutTypes {
  const decrypterStub = makeDecrypter()
  const sut = new DbLoadAccountByToken(decrypterStub)
  return { sut, decrypterStub }
}

function makeDecrypter (): Decrypter {
  class DecrypterStub implements Decrypter {
    decrypt (token: string): string {
      return 'any_value'
    }
  }
  return new DecrypterStub()
}
