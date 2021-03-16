import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'

describe('LogController Decorator', () => {
  test('should call controller with correct value', async () => {
    const { sut, controllerStub } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    await sut.handle(makeFakeHttpRequest())
    expect(handleSpy).toHaveBeenCalledWith(makeFakeHttpRequest())
  })
})

interface SutTypes {
  sut: LogControllerDecorator
  controllerStub: Controller
}

function makeSut (): SutTypes {
  const controllerStub = makeController()
  const sut = new LogControllerDecorator(controllerStub)
  return { sut, controllerStub }
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
