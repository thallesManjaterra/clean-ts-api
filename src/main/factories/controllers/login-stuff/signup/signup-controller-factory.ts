import { SignUpController } from '../../../../../presentation/controllers/login-stuff/signup/signup-controller'
import { Controller } from '../../../../../presentation/protocols'
import { makeLogControllerDecorator } from '../../../decorators/log-controller-decorator-factory'
import { makeDbAddAccount } from '../../../usecases/add-account/db-add-account-factory'
import { makeDbAuthentication } from '../../../usecases/authentication/db-authentication-factory'
import { makeSignUpValidation } from './signup-validation-factory'

export function makeSignUpController (): Controller {
  return makeLogControllerDecorator(
    new SignUpController(makeSignUpValidation(), makeDbAddAccount(), makeDbAuthentication())
  )
}
