import { DbAddAccount } from './db-add-account'
import { AddAccountRepository, AddAccountParams, AccountModel, Hasher, LoadAccountByEmailRepository } from './db-add-account-protocols'

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
    await expect(sut.add).rejects.toThrow()
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
    await expect(sut.add).rejects.toThrow()
  })
  test('should return an account on success', async () => {
    const { sut } = makeSut()
    const account = await sut.add(makeFakeAccountData())
    expect(account).toEqual(makeFakeAccount())
  })
  test('should return null if LoadAccountByEmailRepository returns an account', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockResolvedValueOnce(makeFakeAccount())
    const account = await sut.add(makeFakeAccountData())
    expect(account).toBe(null)
  })
  test('should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    const accountData = makeFakeAccountData()
    await sut.add(accountData)
    expect(loadSpy).toHaveBeenCalledWith(accountData.email)
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

function makeAddAccountRepository (): AddAccountRepository {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (_accountData: AddAccountParams): Promise<AccountModel> {
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

const ANY_EMAIL = 'any_email@mail.com'
const ANY_PASSWORD = 'any_password'
const ANY_NAME = 'any_name'
const ANY_ID = 'any_id'
const ANY_HASH = 'any_hash'

function makeFakeAccount (): AccountModel {
  return {
    id: ANY_ID,
    name: ANY_NAME,
    email: ANY_EMAIL,
    password: makeFakeHash()
  }
}
function makeFakeHash (): string {
  return ANY_HASH
}

function makeFakeAccountData (): AddAccountParams {
  return {
    name: ANY_NAME,
    email: ANY_EMAIL,
    password: ANY_PASSWORD
  }
}
