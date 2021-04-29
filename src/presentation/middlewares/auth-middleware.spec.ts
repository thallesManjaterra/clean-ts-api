import { AccountModel } from '../../domain/models/account'
import { AccessDeniedError } from '../errors'
import { forbidden } from '../helpers/http/http-helper'
import { AuthMiddleware } from './auth-middleware'
import { LoadAccountByToken } from './auth-middleware-protocols'

describe('Auth Middleware', () => {
  test('should return 403 if no x-access-token exists in request headers', async () => {
    const { sut } = makeSut()
    const httpRequest = {}
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })
  test('should call LoadAccountByToken with correct accessToken', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load')
    const httpRequest = {
      headers: {
        'x-access-token': 'any_token'
      }
    }
    await sut.handle(httpRequest)
    expect(loadSpy).toHaveBeenCalledWith('any_token')
  })
})

interface SutTypes {
  sut: AuthMiddleware
  loadAccountByTokenStub: LoadAccountByToken
}

function makeSut (): SutTypes {
  const loadAccountByTokenStub = makeLoadAccountByToken()
  const sut = new AuthMiddleware(loadAccountByTokenStub)
  return { sut, loadAccountByTokenStub }
}

function makeLoadAccountByToken (): LoadAccountByToken {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load (accessToken: string, role?: string): Promise<AccountModel> {
      return await Promise.resolve(makeFakeAccount())
    }
  }
  return new LoadAccountByTokenStub()
}

function makeFakeAccount (): AccountModel {
  return {
    id: 'any_id',
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'hashed_password'
  }
}
