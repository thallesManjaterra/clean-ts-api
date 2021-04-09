import { ValidationComposite, RequiredFieldValidation } from '../../../../../validation/validations'
import { makeAddSurveyValidation } from './add-survey-validation-factory'

jest.mock('../../../../../validation/validations/validation-composite')

describe('AddSurvey Validation', () => {
  test('should call ValidationComposite with all validations', () => {
    makeAddSurveyValidation()
    const requiredFields = ['question', 'answers']
    expect(ValidationComposite).toHaveBeenCalledWith([
      ...makeRequiredFieldValidations(requiredFields)
    ])
  })
})

function makeRequiredFieldValidations (requiredFields: string[]): RequiredFieldValidation[] {
  return requiredFields.map(field => new RequiredFieldValidation(field))
}
