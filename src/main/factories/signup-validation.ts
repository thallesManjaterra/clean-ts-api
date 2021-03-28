import { CompareFieldsValidation } from '../../presentation/helpers/validations/compare-fields-validation'
import { RequiredFieldValidation } from '../../presentation/helpers/validations/required-field-validation'
import { ValidationComposite } from '../../presentation/helpers/validations/validation-composite'

export function makeSignUpValidation (): ValidationComposite {
  const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
  const fieldsToCompare = ['password', 'passwordConfirmation']
  return new ValidationComposite([
    ...makeRequiredFieldValidations(requiredFields),
    makeCompareFieldsValidation(fieldsToCompare)
  ])
}

function makeRequiredFieldValidations (requiredFields: string[]): RequiredFieldValidation[] {
  return requiredFields.map(field => new RequiredFieldValidation(field))
}

function makeCompareFieldsValidation ([field, fieldToCompare]: string[]): CompareFieldsValidation {
  return new CompareFieldsValidation(field, fieldToCompare)
}
