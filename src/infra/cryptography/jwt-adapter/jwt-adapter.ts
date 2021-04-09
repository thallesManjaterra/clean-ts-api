import { Encrypter } from '../../../data/protocols/cryptography/encrypter'
import jwt from 'jsonwebtoken'
import { Decrypter } from '../../../data/protocols/cryptography/decrypter'

export class JwtAdapter implements Encrypter, Decrypter {
  constructor (private readonly secretKey: string) {}

  encrypt (value: string): string {
    const accessToken = jwt.sign({ id: value }, this.secretKey)
    return accessToken
  }

  decrypt (value: string, role?: string): string {
    jwt.verify(value, this.secretKey)
    return null
  }
}
