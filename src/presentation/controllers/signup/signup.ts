import { badRequest, ok, serverError } from '../../helpers/http-helper'
import { Validation } from '../../protocols/validation'
import { AddAccount, Controller, HttpRequest, HttpResponse } from './signup-protocols'

export class SignUpController implements Controller {
  private readonly validation: Validation
  private readonly addAccount: AddAccount
  constructor (
    validation: Validation,
    addAccount: AddAccount
  ) {
    this.validation = validation
    this.addAccount = addAccount
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const { name, email, password } = httpRequest.body
      const account = await this.addAccount.add({ name, email, password })
      return ok(account)
    } catch (error) {
      return serverError(error)
    }
  }
}
