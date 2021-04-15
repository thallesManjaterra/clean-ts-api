import { MissingParamError } from '../../presentation/errors'
import { Validation } from '../../presentation/protocols/validation'
import { ValidationComposite } from './validation-composite'

describe('Validation Composite', () => {
  test('should return an error if any validation fails', () => {
    const { sut, validationStubs } = makeSut()
    jest.spyOn(validationStubs[1], 'validate').mockReturnValueOnce(new MissingParamError('field'))
    const error = sut.validate({})
    expect(error).toEqual(new MissingParamError('field'))
  })
  test('should stop validations and return the error as soon validation fails', () => {
    const { sut, validationStubs } = makeSut()
    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new MissingParamError('field'))
    const secondValidationSpy = jest.spyOn(validationStubs[1], 'validate').mockReturnValueOnce(new MissingParamError('another_field'))
    const error = sut.validate({})
    expect(secondValidationSpy).not.toHaveBeenCalled()
    expect(error).toEqual(new MissingParamError('field'))
  })
  test('should return null if validations succeeds', () => {
    const { sut } = makeSut()
    const error = sut.validate({})
    expect(error).toEqual(null)
  })
})

interface SutTypes {
  sut: ValidationComposite
  validationStubs: Validation[]
}

function makeSut (): SutTypes {
  const validationStubs = [makeValidation(), makeValidation()]
  const sut = new ValidationComposite(validationStubs)
  return { sut, validationStubs }
}

function makeValidation (): Validation {
  class ValidationStub implements Validation {
    validate (_input: any): null | Error {
      return null
    }
  }
  return new ValidationStub()
}
