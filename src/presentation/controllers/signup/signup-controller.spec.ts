import { MissingParamError } from '../../errors'
import { badRequest, ok, serverError } from '../../helpers/http/http-helper'
import { SignUpController } from './signup-controller'
import { AccountModel, AddAccount, AddAccountModel, HttpRequest, Validation, Authentication, AuthenticationDataModel } from './signup-controller-protocols'

describe('Sign Up Controller', () => {
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
  test('should return call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()
    const addAccountSpy = jest.spyOn(addAccountStub, 'add')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    const { name, email, password } = httpRequest.body
    expect(addAccountSpy).toHaveBeenCalledWith({ name, email, password })
  })
  test('should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()
    jest
      .spyOn(addAccountStub, 'add')
      .mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
  test('should return 200 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok(makeFakeAccount()))
  })
  test('should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const httpRequest = makeFakeRequest()
    const authSpy = jest.spyOn(authenticationStub, 'auth')
    await sut.handle(httpRequest)
    const { email, password } = httpRequest.body
    expect(authSpy).toHaveBeenCalledWith({ email, password })
  })
})

interface SutTypes {
  sut: SignUpController
  validationStub: Validation
  addAccountStub: AddAccount
  authenticationStub: Authentication
}

function makeSut (): SutTypes {
  const validationStub = makeValidation()
  const addAccountStub = makeAddAccount()
  const authenticationStub = makeAuthentication()
  const sut = new SignUpController(validationStub, addAccountStub, authenticationStub)
  return { sut, addAccountStub, validationStub, authenticationStub }
}

function makeValidation (): Validation {
  class ValidationStub implements Validation {
    validate (_input: any): null | Error {
      return null
    }
  }
  return new ValidationStub()
}

function makeAddAccount (): AddAccount {
  class AddAccountStub implements AddAccount {
    async add (_accountData: AddAccountModel): Promise<AccountModel> {
      return await Promise.resolve(makeFakeAccount())
    }
  }
  return new AddAccountStub()
}

function makeFakeAccount (): AccountModel {
  return {
    id: 'any_id',
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'hashed_password'
  }
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
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
      passwordConfirmation: 'any_password'
    }
  }
}
