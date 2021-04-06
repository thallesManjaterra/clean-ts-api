import { InvalidParamError } from '../../presentation/errors'
import { Validation } from '../../presentation/protocols/validation'

export class CompareFieldsValidation implements Validation {
  constructor (
    private readonly fieldName: string,
    private readonly fieldNameToCompare: string
  ) {}

  validate (input: any): Error {
    return input[this.fieldName] === input[this.fieldNameToCompare]
      ? null
      : new InvalidParamError(this.fieldName)
  }
}
