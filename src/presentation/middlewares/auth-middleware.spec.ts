import { AccessDeniedError } from '../errors'
import { forbidden } from '../helpers/http/http-helper'
import { AuthMiddleware } from './auth-middleware'

describe('Auth Middleware', () => {
  test('should return 403 if no x-access-token exists in header', async () => {
    const sut = new AuthMiddleware()
    const httpRequest = {}
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })
})
