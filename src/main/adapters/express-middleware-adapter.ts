import { NextFunction, Request, Response } from 'express'
import { HttpRequest, HttpResponse, Middleware } from '../../presentation/protocols'

type ExpressMiddlewareHandler = (req: Request, res: Response, next: NextFunction) => void

export function adaptMiddleware (middleware: Middleware): ExpressMiddlewareHandler {
  return (req: Request, res: Response, next: NextFunction): void => {
    const httpRequest: HttpRequest = {
      headers: req.headers
    }
    middleware.handle(httpRequest)
      .then((httpResponse: HttpResponse) => {
        if (httpResponse.statusCode === 200) {
          Object.assign(req, httpResponse.body)
          next()
        } else {
          res
            .status(httpResponse.statusCode)
            .json({ error: httpResponse.body.message })
        }
      })
      .catch(console.error)
  }
}
