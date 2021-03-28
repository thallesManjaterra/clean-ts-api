import { CompareFieldsValidation } from '../../presentation/helpers/validations/compare-fields-validation'
import { EmailValidation } from '../../presentation/helpers/validations/email-validation'
import { RequiredFieldValidation } from '../../presentation/helpers/validations/required-field-validation'
import { ValidationComposite } from '../../presentation/helpers/validations/validation-composite'
import { EmailValidator } from '../../presentation/protocols/email-validator'
import { makeSignUpValidation } from './signup-validation'

jest.mock('../../presentation/helpers/validations/validation-composite')

describe('SignUp Validation', () => {
  test('should call ValidationComposite with all validations', () => {
    makeSignUpValidation()
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
    const fieldsToCompare = ['password', 'passwordConfirmation']
    const emailField = 'email'
    const emailValidatorStub = makeEmailValidator()
    expect(ValidationComposite).toHaveBeenCalledWith([
      ...makeRequiredFieldValidations(requiredFields),
      makeCompareFieldsValidation(fieldsToCompare),
      makeEmailValidation(emailField, emailValidatorStub)
    ])
  })
})

function makeRequiredFieldValidations (requiredFields: string[]): RequiredFieldValidation[] {
  return requiredFields.map(field => new RequiredFieldValidation(field))
}

function makeCompareFieldsValidation ([field, fieldToCompare]: string[]): CompareFieldsValidation {
  return new CompareFieldsValidation(field, fieldToCompare)
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
