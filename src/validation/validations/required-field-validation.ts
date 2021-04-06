import { MissingParamError } from '../../presentation/errors'
import { Validation } from '../../presentation/protocols/validation'

export class RequiredFieldValidation implements Validation {
  constructor (private readonly fieldName: string) {}

  validate (input: any): Error {
    return input[this.fieldName]
      ? null
      : new MissingParamError(this.fieldName)
  }
}