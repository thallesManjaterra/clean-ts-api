import { CompareFieldsValidation } from '../../presentation/helpers/validations/compare-fields-validation'
import { EmailValidation } from '../../presentation/helpers/validations/email-validation'
import { RequiredFieldValidation } from '../../presentation/helpers/validations/required-field-validation'
import { ValidationComposite } from '../../presentation/helpers/validations/validation-composite'
import { EmailValidator } from '../../presentation/protocols/email-validator'
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter'

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
