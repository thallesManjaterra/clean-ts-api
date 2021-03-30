import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash (_value: string): Promise<string> {
    return await Promise.resolve(makeFakeHash())
  },
  async compare (_value: string, _hash: string): Promise<boolean> {
    return await Promise.resolve(true)
  }
}))

const ANY_VALUE = 'any_value'

describe('Bcrypt Adapter', () => {
  test('should call hash with correct values', async () => {
    const { sut, salt } = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.hash(ANY_VALUE)
    expect(hashSpy).toHaveBeenCalledWith(ANY_VALUE, salt)
  })
  test('should return a valid hash on hash success', async () => {
    const { sut } = makeSut()
    const hash = await sut.hash(ANY_VALUE)
    expect(hash).toBe(makeFakeHash())
  })
  test('should throw if hash throws', async () => {
    const { sut } = makeSut()
    jest.spyOn(bcrypt, 'hash').mockRejectedValueOnce(new Error())
    const promise = sut.hash(ANY_VALUE)
    await expect(promise).rejects.toThrow()
  })
  test('should call compare with correct values', async () => {
    const { sut } = makeSut()
    const compareSpy = jest.spyOn(bcrypt, 'compare')
    await sut.compare('any_value', 'any_hash')
    expect(compareSpy).toHaveBeenCalledWith('any_value', 'any_hash')
  })
})

interface SutTypes {
  sut: BcryptAdapter
  salt: number
}

function makeSut (): SutTypes {
  const salt = 12
  const sut = new BcryptAdapter(salt)
  return { sut, salt }
}

function makeFakeHash (): string {
  return 'any_hash'
}
