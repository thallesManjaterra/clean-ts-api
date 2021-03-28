import { ValidationComposite, RequiredFieldValidation, EmailValidation } from '../../../presentation/helpers/validations'
import { EmailValidator } from '../../../presentation/protocols/email-validator'
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter'

export function makeLoginValidation (): ValidationComposite {
  const requiredFields = ['email', 'password']
  const emailValidatorAdapter = new EmailValidatorAdapter()
  const emailField = 'email'
  return new ValidationComposite([
    ...makeRequiredFieldValidations(requiredFields),
    makeEmailValidation(emailField, emailValidatorAdapter)
  ])
}

function makeRequiredFieldValidations (requiredFields: string[]): RequiredFieldValidation[] {
  return requiredFields.map(field => new RequiredFieldValidation(field))
}

function makeEmailValidation (emailField: string, emailValidator: EmailValidator): EmailValidation {
  return new EmailValidation(emailField, emailValidator)
}
