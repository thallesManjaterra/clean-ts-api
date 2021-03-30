import { Request, Response } from 'express'
import { Controller, HttpRequest, HttpResponse } from '../../../presentation/protocols'

type ExpressRouteHandler = (req: Request, res: Response) => void

export function adaptRoute (controller: Controller): ExpressRouteHandler {
  return (req: Request, res: Response): void => {
    const httpRequest: HttpRequest = {
      body: req.body
    }
    controller.handle(httpRequest)
      .then(({ statusCode, body }: HttpResponse) => {
        res
          .status(statusCode)
          .json(
            statusCode === 200
              ? body
              : { error: body.message }
          )
      })
      .catch(console.error)
  }
}
