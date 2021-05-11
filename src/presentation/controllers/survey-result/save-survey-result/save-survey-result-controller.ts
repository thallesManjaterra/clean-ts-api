import { SaveSurveyResult } from '@/domain/usecases/survey-result/save-survey-result'
import { InvalidParamError } from '@/presentation/errors'
import { forbidden, serverError } from '@/presentation/helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { LoadSurveyById } from './save-survey-result-controller-protocols'

export class SaveSurveyResultController implements Controller {
  constructor (
    private readonly loadSurveyById: LoadSurveyById,
    private readonly saveSurveyResult: SaveSurveyResult
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const surveyId = httpRequest.params?.surveyId
      const answer = httpRequest.body?.answer
      const accountId = httpRequest.accountId
      const survey = await this.loadSurveyById.loadById(surveyId)
      if (survey) {
        const answers = survey.answers.map(({ answer }) => answer)
        if (!answers.includes(answer)) {
          return forbidden(new InvalidParamError('answer'))
        }
        await this.saveSurveyResult.save({
          surveyId, answer, accountId, date: new Date()
        })
      } else {
        return forbidden(new InvalidParamError('surveyId'))
      }
      return null
    } catch (error) {
      return serverError(error)
    }
  }
}
