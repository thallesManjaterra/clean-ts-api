import { RequiredFieldValidation } from '../../presentation/helpers/validations/required-field-validation'
import { ValidationComposite } from '../../presentation/helpers/validations/validation-composite'

export function makeSignUpValidation (): ValidationComposite {
  const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
  return new ValidationComposite([
    ...makeRequiredFieldValidations(requiredFields)
  ])
}

function makeRequiredFieldValidations (requiredFields: string[]): RequiredFieldValidation[] {
  return requiredFields.map(field => new RequiredFieldValidation(field))
}
