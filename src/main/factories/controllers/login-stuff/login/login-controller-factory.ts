import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory'
import { makeDbAuthentication } from '@/main/factories/usecases/account/authentication/db-authentication-factory'
import { LoginController } from '@/presentation/controllers/login-stuff/login/login-controller'
import { Controller } from '@/presentation/protocols'
import { makeLoginValidation } from './login-validation-factory'

export function makeLoginController (): Controller {
  const loginController = new LoginController(makeLoginValidation(), makeDbAuthentication())
  return makeLogControllerDecorator(loginController)
}
