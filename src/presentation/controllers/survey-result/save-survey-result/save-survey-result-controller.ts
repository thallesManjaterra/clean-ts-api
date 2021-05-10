import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { LoadSurveyById } from './save-survey-result-controller-protocols'

export class SaveSurveyResultController implements Controller {
  constructor (
    private readonly loadSurveyById: LoadSurveyById
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const surveyId = httpRequest.params?.surveyId
    await this.loadSurveyById.loadById(surveyId)
    return null
  }
}
