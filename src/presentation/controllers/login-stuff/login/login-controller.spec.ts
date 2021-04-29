import { MissingParamError } from '../../../errors'
import { serverError, badRequest, unauthorized, ok } from '../../../helpers/http/http-helper'
import { LoginController } from './login-controller'
import { Authentication, AuthenticationDataModel, HttpRequest, Validation } from './login-controller-protocols'

describe('Login Controller', () => {
  test('should call Validation with correct value', async () => {
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
  authenticationStub: Authentication
}

function makeSut (): SutTypes {
  const validationStub = makeValidation()
  const authenticationStub = makeAuthentication()
  const sut = new LoginController(validationStub, authenticationStub)
  return { sut, validationStub, authenticationStub }
}

function makeValidation (): Validation {
  class ValidationStub implements Validation {
    validate (_input: any): null | Error {
      return null
    }
  }
  return new ValidationStub()
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
