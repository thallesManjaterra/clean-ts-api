import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, ok, serverError } from '../../helpers/http-helper'
import { Validation } from '../../protocols/validation'
import { AddAccount, Controller, EmailValidator, HttpRequest, HttpResponse } from './signup-protocols'

export class SignUpController implements Controller {
  private readonly validation: Validation
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount
  constructor (
    validation: Validation,
    emailValidator: EmailValidator,
    addAccount: AddAccount
  ) {
    this.validation = validation
    this.emailValidator = emailValidator
    this.addAccount = addAccount
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    this.validation.validate(httpRequest.body)
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }
    const { name, email, password, passwordConfirmation } = httpRequest.body
    if (password !== passwordConfirmation) {
      return badRequest(new InvalidParamError('password'))
    }
    try {
      const isEmailValid = this.emailValidator.isValid(email)
      if (!isEmailValid) {
        return badRequest(new InvalidParamError('email'))
      }
      const account = await this.addAccount.add({ name, email, password })
      return ok(account)
    } catch (error) {
      return serverError(error)
    }
  }
}
