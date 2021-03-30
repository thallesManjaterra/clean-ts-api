import { MissingParamError } from '../../errors'
import { Validation } from '../../protocols/validation'

export class RequiredFieldValidation implements Validation {
  constructor (private readonly fieldName: string) {}

  validate (input: any): Error {
    return input[this.fieldName]
      ? null
      : new MissingParamError(this.fieldName)
  }
}
