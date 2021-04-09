import { Decrypter } from '../../protocols/cryptography/decrypter'
import { DbloadAccountByToken } from './load-account-by-token'

describe('DbloadAccountByToken Usecase', () => {
  test('should call Decrypter with correct values ', async () => {
    class DecrypterStub implements Decrypter {
      decrypt (value: string): string {
        return 'any_value'
      }
    }
    const decrypterStub = new DecrypterStub()
    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')
    const sut = new DbloadAccountByToken(decrypterStub)
    await sut.load('any_token')
    expect(decryptSpy).toHaveBeenCalledWith('any_token')
  })
})
