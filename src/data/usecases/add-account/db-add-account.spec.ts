import { AddAccountModel } from '../../../domain/usecases/add-account'
import { Encrypter } from '../../protocols/encrypter'
import { DbAddAccount } from './db-add-account'

describe('DbAddAccount Usecase', () => {
  test('should call encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    const accountData = makeFakeAccountData()
    await sut.add(accountData)
    expect(encryptSpy).toHaveBeenCalledWith(accountData.password)
  })
})

interface SutTypes {
  sut: DbAddAccount
  encrypterStub: Encrypter
}

function makeSut (): SutTypes {
  const encrypterStub = makeEncrypter()
  const sut = new DbAddAccount(encrypterStub)
  return { sut, encrypterStub }
}

function makeEncrypter (): Encrypter {
  class EncrypterStub implements Encrypter {
    async encrypt (_value: string): Promise<string> {
      return await Promise.resolve('hashed_value')
    }
  }
  return new EncrypterStub()
}

function makeFakeAccountData (): AddAccountModel {
  return {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password'
  }
}
