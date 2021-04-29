import { AccessDeniedError } from '../errors'
import { forbidden, ok } from '../helpers/http/http-helper'
import { HttpRequest, HttpResponse, Middleware, LoadAccountByToken } from './auth-middleware-protocols'

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly loadAccountByTokenStub: LoadAccountByToken
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const accessToken = httpRequest.headers?.['x-access-token']
    if (accessToken) {
      const account = await this.loadAccountByTokenStub.load(accessToken)
      if (account) {
        return ok({ accountId: account.id })
      }
    }
    return forbidden(new AccessDeniedError())
  }
}
