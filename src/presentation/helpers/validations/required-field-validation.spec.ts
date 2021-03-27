import { MissingParamError } from '../../errors'
import { RequiredFieldValidation } from './required-field-validation'

describe('Required Field Validation', () => {
  test('should return a MissingParamError if validation fails', () => {
    const sut = new RequiredFieldValidation('field')
    const error = sut.validate({})
    expect(error).toEqual(new MissingParamError('field'))
  })
  test('should return null if validation succeeds', () => {
    const sut = new RequiredFieldValidation('field')
    const error = sut.validate({ field: 'any_value' })
    expect(error).toEqual(null)
  })
})
