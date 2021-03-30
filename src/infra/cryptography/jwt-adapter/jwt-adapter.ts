import { Encrypter } from '../../../data/protocols/cryptography/encrypter'
import jwt from 'jsonwebtoken'

export class JwtAdapter implements Encrypter {
  constructor (private readonly secretKey: string) {}

  encrypt (value: string): string {
    jwt.sign(value, this.secretKey)
    return null
  }
}
