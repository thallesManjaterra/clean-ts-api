import { Decrypter } from '../../protocols/cryptography/decrypter'
import { DbloadAccountByToken } from './load-account-by-token'

describe('DbloadAccountByToken Usecase', () => {
  test('should call Decrypter with correct values ', async () => {
    const { sut, decrypterStub } = makeSut()
    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')
    await sut.load('any_token')
    expect(decryptSpy).toHaveBeenCalledWith('any_token')
  })
})

interface SutTypes {
  sut: DbloadAccountByToken
  decrypterStub: Decrypter
}

function makeSut (): SutTypes {
  const decrypterStub = makeDecrypter()
  const sut = new DbloadAccountByToken(decrypterStub)
  return { sut, decrypterStub }
}

function makeDecrypter (): Decrypter {
  class DecrypterStub implements Decrypter {
    decrypt (value: string): string {
      return 'any_value'
    }
  }
  return new DecrypterStub()
}
