import { ValidationComposite, RequiredFieldValidation, EmailValidation } from '../../../../../validation/validators'
import { EmailValidator } from '../../../../../validation/protocols/email-validator'
import { EmailValidatorAdapter } from '../../../../../infra/validators/email-validator-adapter'

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
