import { InvalidParamError } from '../../presentation/errors'
import { EmailValidator } from '../protocols/email-validator'
import { Validation } from '../../presentation/protocols/validation'

export class EmailValidation implements Validation {
  constructor (
    private readonly fieldName: string,
    private readonly emailValidator: EmailValidator
  ) {}

  validate (input: any): Error {
    const isEmailValid = this.emailValidator.isValid(input[this.fieldName])
    return isEmailValid
      ? null
      : new InvalidParamError(this.fieldName)
  }
}
