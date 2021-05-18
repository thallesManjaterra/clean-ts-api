import { Decrypter } from '../protocols/cryptography/decrypter'
import { Encrypter } from '../protocols/cryptography/encrypter'
import { HashComparer } from '../protocols/cryptography/hash-comparer'
import { Hasher } from '../protocols/cryptography/hasher'

export function mockHasher (): Hasher {
  class HasherStub implements Hasher {
    async hash (_value: string): Promise<string> {
      return await Promise.resolve(mockHash())
    }
  }
  return new HasherStub()
}

export function mockHash (): string {
  return 'any_hash'
}

export function mockEncrypter (): Encrypter {
  class EncrypterStub implements Encrypter {
    encrypt (_id: string): string {
      return mockAccessToken()
    }
  }
  return new EncrypterStub()
}

export function mockAccessToken (): string {
  return 'any_token'
}

export function mockDecrpyter (): Decrypter {
  class DecrypterStub implements Decrypter {
    decrypt (token: string): string {
      return 'any_value'
    }
  }
  return new DecrypterStub()
}

export function mockHashComparer (): HashComparer {
  class HashComparerStub implements HashComparer {
    async compare (_value: string, _hash: string): Promise<boolean> {
      return await Promise.resolve(true)
    }
  }
  return new HashComparerStub()
}
