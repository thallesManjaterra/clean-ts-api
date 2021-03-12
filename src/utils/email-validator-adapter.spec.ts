import { EmailValidatorAdapter } from './email-validator-adapter'
import validator from 'validator'

jest.mock('validator', () => ({
  isEmail (_email: string): boolean {
    return true
  }
}))

describe('Email Validator Adapter', () => {
  test('should return false if validator returns false', () => {
    const sut = new EmailValidatorAdapter()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const isEmailValid = sut.isValid('invalid_email@mail.com')
    expect(isEmailValid).toBe(false)
  })
  test('should return true if validator returns true', () => {
    const sut = new EmailValidatorAdapter()
    const isEmailValid = sut.isValid('valid_email@mail.com')
    expect(isEmailValid).toBe(true)
  })
  test('should call validator with correct email', () => {
    const sut = new EmailValidatorAdapter()
    const isEmailSpy = jest.spyOn(validator, 'isEmail')
    const ANY_EMAIL = 'any_email@mail.com'
    sut.isValid(ANY_EMAIL)
    expect(isEmailSpy).toHaveBeenCalledWith(ANY_EMAIL)
  })
  test('should throw if validator throws', () => {
    const sut = new EmailValidatorAdapter()
    jest
      .spyOn(validator, 'isEmail')
      .mockImplementationOnce(() => { throw new Error() })
    expect(sut.isValid).toThrow()
  })
})
