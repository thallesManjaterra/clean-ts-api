import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

const SECRET_KEY = 'secret_key'
const ANY_ID = 'any_id'
const ANY_TOKEN = 'any_token'
const ANY_VALUE = 'any_value'

jest.mock('jsonwebtoken', () => ({
  sign () {
    return ANY_TOKEN
  },
  verify () {
    return ANY_VALUE
  }
}))

describe('Jwt Adapter', () => {
  describe('sign()', () => {
    test('should call sign with correct values', () => {
      const sut = makeSut()
      const signSpy = jest.spyOn(jwt, 'sign')
      sut.encrypt(ANY_ID)
      expect(signSpy).toHaveBeenCalledWith({ id: ANY_ID }, SECRET_KEY)
    })
    test('should return a token on sign success', () => {
      const sut = makeSut()
      const accessToken = sut.encrypt(ANY_ID)
      expect(accessToken).toBe(ANY_TOKEN)
    })
    test('should throw if sign throws', () => {
      const sut = makeSut()
      jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
        throw new Error()
      })
      expect(sut.encrypt).toThrow()
    })
  })
  describe('verify()', () => {
    test('should call verify with correct values', () => {
      const sut = makeSut()
      const verifySpy = jest.spyOn(jwt, 'verify')
      sut.decrypt(ANY_TOKEN)
      expect(verifySpy).toHaveBeenCalledWith(ANY_TOKEN, SECRET_KEY)
    })
  })
})

function makeSut (): JwtAdapter {
  return new JwtAdapter(SECRET_KEY)
}
