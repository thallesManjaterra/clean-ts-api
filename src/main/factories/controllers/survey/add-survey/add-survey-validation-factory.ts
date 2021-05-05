import { ValidationComposite, RequiredFieldValidation } from '@/validation/validators'

export function makeAddSurveyValidation (): ValidationComposite {
  const requiredFields = ['question', 'answers']
  return new ValidationComposite([
    ...makeRequiredFieldValidations(requiredFields)
  ])
}

function makeRequiredFieldValidations (requiredFields: string[]): RequiredFieldValidation[] {
  return requiredFields.map(field => new RequiredFieldValidation(field))
}
