import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

const SECRET_KEY = 'secret_key'
const ANY_ID = 'any_id'
const ANY_TOKEN = 'any_token'

jest.mock('jsonwebtoken', () => ({
  sign () {
    return ANY_TOKEN
  }
}))

describe('Jwt Adapter', () => {
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

function makeSut (): JwtAdapter {
  return new JwtAdapter(SECRET_KEY)
}
