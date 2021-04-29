import { AddSurvey } from '../../../../domain/usecases/add-survey'
import { badRequest, serverError } from '../../../helpers/http/http-helper'
import { Validation } from '../../../protocols'
import { Controller, HttpRequest, HttpResponse } from './add-survey-protocols'

export class AddSurveyController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly addSurvey: AddSurvey
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const { question, answers } = httpRequest.body
      await this.addSurvey.add({ question, answers })
      return null
    } catch (error) {
      return serverError(error)
    }
  }
}
