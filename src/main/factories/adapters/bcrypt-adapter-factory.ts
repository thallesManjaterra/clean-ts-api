import { BcryptAdapter } from '../../../infra/cryptography/bcrypt-adapter/bcrypt-adapter'

export function makeBcryptAdapter (): BcryptAdapter {
  const salt = 12
  return new BcryptAdapter(salt)
}
