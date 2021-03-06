import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { Request, Response } from 'express'

type ExpressRouteHandler = (req: Request, res: Response) => void

export function adaptRoute (controller: Controller): ExpressRouteHandler {
  return (req: Request, res: Response): void => {
    const httpRequest: HttpRequest = {
      body: req.body,
      params: req.params,
      accountId: req.accountId
    }
    controller.handle(httpRequest)
      .then(({ statusCode, body }: HttpResponse) => {
        res
          .status(statusCode)
          .json(
            statusCode >= 200 && statusCode < 300
              ? body
              : { error: body.message }
          )
      })
      .catch(console.error)
  }
}
