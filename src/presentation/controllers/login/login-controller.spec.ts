import { AuthenticationDataModel } from '../../../domain/usecases/authentication'
import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, ok, serverError, unauthorized } from '../../helpers/http/http-helper'
import { LoginController } from './login-controller'
import { Authentication, EmailValidator, HttpRequest, Validation } from './login-controller-protocols'

describe('Login Controller', () => {
  test('should call Validations with correct value', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })
  test('should return 500 if Validation throws', async () => {
    const { sut, validationStub } = makeSut()
    jest
      .spyOn(validationStub, 'validate')
      .mockImplementationOnce(() => { throw new Error() })
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
  test('should return 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  })
  test('should returns 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })
  test('should returns 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })
  test('should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const httpRequest = makeFakeRequest()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    await sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body.email)
  })
  test('should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const httpRequest = makeFakeRequest()
    jest
      .spyOn(emailValidatorStub, 'isValid')
      .mockReturnValueOnce(false)
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })
  test('should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const httpRequest = makeFakeRequest()
    jest
      .spyOn(emailValidatorStub, 'isValid')
      .mockImplementationOnce(() => { throw new Error() })
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new Error()))
  })
  test('should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const httpRequest = makeFakeRequest()
    const authSpy = jest.spyOn(authenticationStub, 'auth')
    await sut.handle(httpRequest)
    const { email, password } = httpRequest.body
    expect(authSpy).toHaveBeenCalledWith({ email, password })
  })
  test('should return 401 if invalid credentials are provided', async () => {
    const { sut, authenticationStub } = makeSut()
    const httpRequest = makeFakeRequest()
    jest
      .spyOn(authenticationStub, 'auth')
      .mockResolvedValueOnce(null)
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(unauthorized())
  })
  test('should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()
    const httpRequest = makeFakeRequest()
    jest
      .spyOn(authenticationStub, 'auth')
      .mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new Error()))
  })
  test('should return 200 if valid credentials are provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok({
      accessToken: makeFakeToken()
    }))
  })
})

interface SutTypes {
  sut: LoginController
  validationStub: Validation
  emailValidatorStub: EmailValidator
  authenticationStub: Authentication
}

function makeSut (): SutTypes {
  const validationStub = makeValidation()
  const emailValidatorStub = makeEmailValidator()
  const authenticationStub = makeAuthentication()
  const sut = new LoginController(validationStub, emailValidatorStub, authenticationStub)
  return { sut, validationStub, emailValidatorStub, authenticationStub }
}

function makeValidation (): Validation {
  class ValidationStub implements Validation {
    validate (_input: any): null | Error {
      return null
    }
  }
  return new ValidationStub()
}

function makeEmailValidator (): EmailValidator {
  class EmailValidatorStub implements EmailValidator {
    isValid (_email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

function makeAuthentication (): Authentication {
  class AuthenticationStub implements Authentication {
    async auth (_authenticationData: AuthenticationDataModel): Promise<string> {
      return await Promise.resolve(makeFakeToken())
    }
  }
  return new AuthenticationStub()
}

function makeFakeToken (): string {
  return 'any_token'
}

function makeFakeRequest (): HttpRequest {
  return {
    body: {
      email: 'any_email',
      password: 'any_password'
    }
  }
}
