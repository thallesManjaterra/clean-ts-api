import { Encrypter } from '../../../data/protocols/cryptography/encrypter'
import jwt from 'jsonwebtoken'
import { Decrypter } from '../../../data/protocols/cryptography/decrypter'

export class JwtAdapter implements Encrypter, Decrypter {
  constructor (private readonly secretKey: string) {}

  encrypt (value: string): string {
    const accessToken = jwt.sign({ id: value }, this.secretKey)
    return accessToken
  }

  decrypt (token: string): string {
    jwt.verify(token, this.secretKey)
    return null
  }
}
