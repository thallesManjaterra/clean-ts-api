import { InvalidParamError } from '../../presentation/errors'
import { CompareFieldsValidation } from './compare-fields-validation'

describe('Compare Fields Validation', () => {
  test('should return a InvalidParamError if validation fails', () => {
    const sut = makeSut()
    const error = sut.validate({
      field: 'any_value',
      fieldToCompare: 'another_value'
    })
    expect(error).toEqual(new InvalidParamError('field'))
  })
  test('should return null if validation succeeds', () => {
    const sut = makeSut()
    const error = sut.validate({
      field: 'any_value',
      fieldToCompare: 'any_value'
    })
    expect(error).toEqual(null)
  })
})

function makeSut (): CompareFieldsValidation {
  return new CompareFieldsValidation('field', 'fieldToCompare')
}
