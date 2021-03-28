import { CompareFieldsValidation } from '../../presentation/helpers/validations/compare-fields-validation'
import { RequiredFieldValidation } from '../../presentation/helpers/validations/required-field-validation'
import { ValidationComposite } from '../../presentation/helpers/validations/validation-composite'
import { makeSignUpValidation } from './signup-validation'

jest.mock('../../presentation/helpers/validations/validation-composite')

describe('SignUp Validation', () => {
  test('should call ValidationComposite with all validations', () => {
    makeSignUpValidation()
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
    const fieldsToCompare = ['password', 'passwordConfirmation']
    expect(ValidationComposite).toHaveBeenCalledWith([
      ...makeRequiredFieldValidations(requiredFields),
      makeCompareFieldsValidation(fieldsToCompare)
    ])
  })
})

function makeRequiredFieldValidations (requiredFields: string[]): RequiredFieldValidation[] {
  return requiredFields.map(field => new RequiredFieldValidation(field))
}

function makeCompareFieldsValidation ([field, fieldToCompare]: string[]): CompareFieldsValidation {
  return new CompareFieldsValidation(field, fieldToCompare)
}
