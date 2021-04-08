import { AddSurvey, AddSurveyDataModel } from '../../../domain/usecases/add-survey'
import { AddSurveyRepository } from '../../protocols/db/survey/add-survey-repository'

export class DbAddSurvey implements AddSurvey {
  constructor (
    private readonly addSurveyRepository: AddSurveyRepository
  ) {}

  async add (surveyData: AddSurveyDataModel): Promise<void> {
    await this.addSurveyRepository.add(surveyData)
  }
}
