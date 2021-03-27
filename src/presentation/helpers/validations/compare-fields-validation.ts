import { InvalidParamError } from '../../errors'
import { Validation } from '../../protocols/validation'

export class CompareFieldsValidation implements Validation {
  private readonly fieldName: string
  private readonly fieldNameToCompare: string
  constructor (fieldName: string, fieldNameToCompare: string) {
    this.fieldName = fieldName
    this.fieldNameToCompare = fieldNameToCompare
  }

  validate (input: any): Error {
    return input[this.fieldName] === input[this.fieldNameToCompare]
      ? null
      : new InvalidParamError(this.fieldName)
  }
}
