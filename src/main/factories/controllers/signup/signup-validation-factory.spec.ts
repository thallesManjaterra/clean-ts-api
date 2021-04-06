import { EmailValidator } from '../../../../validation/protocols/email-validator'
import { ValidationComposite, RequiredFieldValidation, CompareFieldsValidation, EmailValidation } from '../../../../validation/validations'
import { makeSignUpValidation } from './signup-validation-factory'

jest.mock('../../../../validation/validations/validation-composite')

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
