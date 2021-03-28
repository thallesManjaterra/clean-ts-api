import { EmailValidator } from '../../protocols/email-validator'
import { EmailValidation } from './email-validation'

describe('Email Validation', () => {
  test('should call EmailValidator with correct email', () => {
    const { sut, emailValidatorStub } = makeSut()
    const validateSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const email = 'any_email'
    sut.validate({ email })
    expect(validateSpy).toHaveBeenCalledWith(email)
  })
})

interface SutTypes {
  sut: EmailValidation
  emailValidatorStub: EmailValidator
}

function makeSut (): SutTypes {
  const fieldName = 'email'
  const emailValidatorStub = makeEmailValidator()
  const sut = new EmailValidation(fieldName, emailValidatorStub)
  return { sut, emailValidatorStub }
}

function makeEmailValidator (): EmailValidator {
  class EmailValidatorStub implements EmailValidator {
    isValid (_email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}
