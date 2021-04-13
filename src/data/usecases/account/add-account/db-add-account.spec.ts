import { LoadAccountByEmailRepository } from '../authentication/db-authentication-protocols'
import { DbAddAccount } from './db-add-account'
import { AddAccountRepository, AddAccountModel, AccountModel, Hasher } from './db-add-account-protocols'

describe('DbAddAccount Usecase', () => {
  test('should call Hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut()
    const hashSpy = jest.spyOn(hasherStub, 'hash')
    const accountData = makeFakeAccountData()
    await sut.add(accountData)
    expect(hashSpy).toHaveBeenCalledWith(accountData.password)
  })
  test('should throw if Hasher throws', async () => {
    const { sut, hasherStub } = makeSut()
    jest
      .spyOn(hasherStub, 'hash')
      .mockRejectedValueOnce(new Error())
    const promise = sut.add(makeFakeAccountData())
    await expect(promise).rejects.toThrow()
  })
  test('should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    const accountData = makeFakeAccountData()
    await sut.add(accountData)
    expect(addSpy).toHaveBeenCalledWith({ ...accountData, password: makeFakeHash() })
  })
  test('should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest
      .spyOn(addAccountRepositoryStub, 'add')
      .mockRejectedValueOnce(new Error())
    const promise = sut.add(makeFakeAccountData())
    await expect(promise).rejects.toThrow()
  })
  test('should return an account on success', async () => {
    const { sut } = makeSut()
    const account = await sut.add(makeFakeAccountData())
    expect(account).toEqual(makeFakeAccount())
  })
  test('should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadByEmailSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    const accountData = makeFakeAccountData()
    await sut.add(accountData)
    expect(loadByEmailSpy).toHaveBeenCalledWith(accountData.email)
  })
  test('should return null if LoadAccountByEmailRepository returns an account', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockResolvedValueOnce(makeFakeAccount())
    const account = await sut.add(makeFakeAccountData())
    expect(account).toEqual(null)
  })
})

interface SutTypes {
  sut: DbAddAccount
  hasherStub: Hasher
  addAccountRepositoryStub: AddAccountRepository
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

function makeSut (): SutTypes {
  const hasherStub = makeHasher()
  const addAccountRepositoryStub = makeAddAccountRepository()
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
  const sut = new DbAddAccount(hasherStub, addAccountRepositoryStub, loadAccountByEmailRepositoryStub)
  return { sut, hasherStub, addAccountRepositoryStub, loadAccountByEmailRepositoryStub }
}

function makeHasher (): Hasher {
  class HasherStub implements Hasher {
    async hash (_value: string): Promise<string> {
      return await Promise.resolve(makeFakeHash())
    }
  }
  return new HasherStub()
}

function makeFakeHash (): string {
  return 'any_hash'
}

function makeAddAccountRepository (): AddAccountRepository {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (_accountData: AddAccountModel): Promise<AccountModel> {
      return await Promise.resolve(makeFakeAccount())
    }
  }
  return new AddAccountRepositoryStub()
}

function makeLoadAccountByEmailRepository (): LoadAccountByEmailRepository {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail (_email: string): Promise<AccountModel> {
      return await Promise.resolve(null)
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

function makeFakeAccount (): AccountModel {
  return {
    id: 'any_id',
    name: 'any_name',
    email: 'any_email@mail.com',
    password: makeFakeHash()
  }
}

function makeFakeAccountData (): AddAccountModel {
  return {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password'
  }
}
