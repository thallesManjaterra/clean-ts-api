import { NextFunction, Request, Response } from 'express'
import { HttpRequest, HttpResponse } from '../../presentation/protocols'
import { Middleware } from '../../presentation/protocols/middleware'

export function adaptMiddleware (middleware: Middleware) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const httpRequest: HttpRequest = {
      headers: req.headers
    }
    middleware.handle(httpRequest)
      .then(({ statusCode, body }: HttpResponse) => {
        if (statusCode === 200) {
          Object.assign(req, body)
          next()
        } else {
          res
            .status(statusCode)
            .json({ error: body.message })
        }
      })
      .catch(console.error)
  }
}
