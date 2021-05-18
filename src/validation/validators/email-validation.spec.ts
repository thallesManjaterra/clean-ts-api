import { InvalidParamError } from '@/presentation/errors'
import { EmailValidator } from '../protocols/email-validator'
import { mockEmailValidator } from '../test'
import { EmailValidation } from './email-validation'

describe('Email Validation', () => {
  test('should call EmailValidator with correct email', () => {
    const { sut, emailValidatorStub } = makeSut()
    const validateSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const dataToValidate = makeFakeInput()
    sut.validate(dataToValidate)
    expect(validateSpy).toHaveBeenCalledWith(dataToValidate.email)
  })
  test('should throw if EmailValidator throws', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    expect(sut.validate).toThrow()
  })
  test('should return an InvalidParamError if EmailValidator fails', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const error = sut.validate(makeFakeInput())
    expect(error).toEqual(new InvalidParamError('email'))
  })
  test('should return null if EmailValidator succeeds', () => {
    const { sut } = makeSut()
    const error = sut.validate(makeFakeInput())
    expect(error).toBe(null)
  })
})

interface SutTypes {
  sut: EmailValidation
  emailValidatorStub: EmailValidator
}

function makeSut (): SutTypes {
  const fieldName = 'email'
  const emailValidatorStub = mockEmailValidator()
  const sut = new EmailValidation(fieldName, emailValidatorStub)
  return { sut, emailValidatorStub }
}

function makeFakeInput (): any {
  return {
    email: 'any_email'
  }
}
