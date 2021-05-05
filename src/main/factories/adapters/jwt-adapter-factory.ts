import { JwtAdapter } from '@/infra/cryptography/jwt-adapter/jwt-adapter'
import env from '@/main/config/env'

export function makeJwtAdapter (): JwtAdapter {
  return new JwtAdapter(env.jwtSecretKey)
}
