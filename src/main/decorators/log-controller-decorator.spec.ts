import { LogErrorRepository } from '../../data/protocols/db/log/log-error-repository'
import { serverError } from '../../presentation/helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log-controller-decorator'

describe('LogController Decorator', () => {
  test('should call controller with correct value', async () => {
    const { sut, controllerStub } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    await sut.handle(makeFakeHttpRequest())
    expect(handleSpy).toHaveBeenCalledWith(makeFakeHttpRequest())
  })
  test('should return the same as controller', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeHttpRequest())
    expect(httpResponse).toEqual(makeFakeHttpReponse())
  })
  test('should call LogErrorRepository with correct value if controller returns a server erorr', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()
    const fakeError = makeFakeError()
    jest.spyOn(controllerStub, 'handle').mockResolvedValueOnce(serverError(fakeError))
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError')
    await sut.handle(makeFakeHttpRequest())
    expect(logSpy).toHaveBeenCalledWith(fakeError.stack)
  })
})

interface SutTypes {
  sut: LogControllerDecorator
  controllerStub: Controller
  logErrorRepositoryStub: LogErrorRepository
}

function makeSut (): SutTypes {
  const controllerStub = makeController()
  const logErrorRepositoryStub = makeFakeLogErrorRepository()
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)
  return { sut, controllerStub, logErrorRepositoryStub }
}

function makeController (): Controller {
  class ControllerStub implements Controller {
    async handle (_httpRequest: HttpRequest): Promise<HttpResponse> {
      return await Promise.resolve(makeFakeHttpReponse())
    }
  }
  return new ControllerStub()
}

function makeFakeHttpReponse (): HttpResponse {
  return { statusCode: 200, body: {} }
}

function makeFakeLogErrorRepository (): LogErrorRepository {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async logError (_errorStack: string): Promise<void> {
      return await Promise.resolve()
    }
  }
  return new LogErrorRepositoryStub()
}

function makeFakeHttpRequest (): HttpRequest {
  return {
    body: {
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
      passwordConfirmation: 'any_password'
    }
  }
}

function makeFakeError (): Error {
  const fakeError = new Error()
  fakeError.stack = 'any_stack'
  return fakeError
}
