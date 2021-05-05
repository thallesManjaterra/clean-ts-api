import { ServerError } from '@/presentation/errors'
import { UnauthorizedError } from '@/presentation/errors/unauthorized-error'
import { HttpResponse } from '@/presentation/protocols'

export function badRequest (error: Error): HttpResponse {
  return {
    statusCode: 400,
    body: error
  }
}

export function forbidden (error: Error): HttpResponse {
  return {
    statusCode: 403,
    body: error
  }
}

export function serverError (error: Error): HttpResponse {
  return {
    statusCode: 500,
    body: new ServerError(error.stack)
  }
}

export function unauthorized (): HttpResponse {
  return {
    statusCode: 401,
    body: new UnauthorizedError()
  }
}

export function noContent (): HttpResponse {
  return {
    statusCode: 204,
    body: null
  }
}

export function ok (data: any): HttpResponse {
  return {
    statusCode: 200,
    body: data
  }
}
