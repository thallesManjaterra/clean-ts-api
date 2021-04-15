import { ValidationComposite, RequiredFieldValidation, CompareFieldsValidation, EmailValidation } from '../../../../validation/validators'
import { EmailValidator } from '../../../../validation/protocols/email-validator'
import { EmailValidatorAdapter } from '../../../adapters/validators/email-validator-adapter'

export function makeSignUpValidation (): ValidationComposite {
  const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
  const fieldsToCompare = ['password', 'passwordConfirmation']
  const emailValidatorAdapter = new EmailValidatorAdapter()
  const emailField = 'email'
  return new ValidationComposite([
    ...makeRequiredFieldValidations(requiredFields),
    makeCompareFieldsValidation(fieldsToCompare),
    makeEmailValidation(emailField, emailValidatorAdapter)
  ])
}

function makeRequiredFieldValidations (requiredFields: string[]): RequiredFieldValidation[] {
  return requiredFields.map(field => new RequiredFieldValidation(field))
}

function makeCompareFieldsValidation ([field, fieldToCompare]: string[]): CompareFieldsValidation {
  return new CompareFieldsValidation(field, fieldToCompare)
}

function makeEmailValidation (emailField: string, emailValidator: EmailValidator): EmailValidation {
  return new EmailValidation(emailField, emailValidator)
}
