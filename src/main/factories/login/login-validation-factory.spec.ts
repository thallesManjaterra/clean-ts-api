import { ValidationComposite, RequiredFieldValidation, EmailValidation } from '../../../presentation/helpers/validations'
import { EmailValidator } from '../../../presentation/protocols/email-validator'
import { makeLoginValidation } from './login-validation-factory'

jest.mock('../../../presentation/helpers/validations/validation-composite')

describe('Login Validation', () => {
  test('should call ValidationComposite with all validations', () => {
    makeLoginValidation()
    const requiredFields = ['email', 'password']
    const emailField = 'email'
    const emailValidatorStub = makeEmailValidator()
    expect(ValidationComposite).toHaveBeenCalledWith([
      ...makeRequiredFieldValidations(requiredFields),
      makeEmailValidation(emailField, emailValidatorStub)
    ])
  })
})

function makeRequiredFieldValidations (requiredFields: string[]): RequiredFieldValidation[] {
  return requiredFields.map(field => new RequiredFieldValidation(field))
}

function makeEmailValidation (emailField: string, emailValidator: EmailValidator): EmailValidation {
  return new EmailValidation(emailField, emailValidator)
}

function makeEmailValidator (): EmailValidator {
  class EmailValidatorStub implements EmailValidator {
    isValid (_email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}