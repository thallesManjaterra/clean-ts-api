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
})

interface SutTypes {
  sut: DbAddAccount
  hasherStub: Hasher
  addAccountRepositoryStub: AddAccountRepository
}

function makeSut (): SutTypes {
  const hasherStub = makeHasher()
  const addAccountRepositoryStub = makeAddAccountRepository()
  const sut = new DbAddAccount(hasherStub, addAccountRepositoryStub)
  return { sut, hasherStub, addAccountRepositoryStub }
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
    async add (_accountData: AddAccountModel): Promise<AccountModel> {
      return await Promise.resolve(makeFakeAccount())
    }
  }
  return new AddAccountRepositoryStub()
}

const ANY_EMAIL = 'any_email'
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

function makeFakeAccountData (): AddAccountModel {
  return {
    name: ANY_NAME,
    email: ANY_EMAIL,
    password: ANY_PASSWORD
  }
}
