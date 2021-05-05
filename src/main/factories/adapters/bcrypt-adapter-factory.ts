import { BcryptAdapter } from '@/infra/cryptography/bcrypt-adapter/bcrypt-adapter'

export function makeBcrypAdpater (): BcryptAdapter {
  const salt = 12
  return new BcryptAdapter(salt)
}
