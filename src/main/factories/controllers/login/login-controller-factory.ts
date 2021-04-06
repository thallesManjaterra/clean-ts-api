import { LoginController } from '../../../../presentation/controllers/login-stuff/login/login-controller'
import { Controller } from '../../../../presentation/protocols'
import { makeLogControllerDecorator } from '../../decorators/log-controller-decorator-factory'
import { makeDbAuthentication } from '../../usecases/authentication/db-authentication-factory'
import { makeLoginValidation } from './login-validation-factory'

export function makeLoginController (): Controller {
  return makeLogControllerDecorator(
    new LoginController(makeLoginValidation(), makeDbAuthentication())
  )
}
