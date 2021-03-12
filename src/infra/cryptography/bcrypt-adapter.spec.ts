import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter.'

jest.mock('bcrypt', () => ({
  async hash (_value: string): Promise<string> {
    return await Promise.resolve(makeFakeHash())
  }
}))

describe('Bcrypt Adapter', () => {
  test('should call bcrypt with correct values', async () => {
    const { sut, salt } = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })
  test('should return a hash on success', async () => {
    const { sut } = makeSut()
    const hash = await sut.encrypt('any_value')
    expect(hash).toBe(makeFakeHash())
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
