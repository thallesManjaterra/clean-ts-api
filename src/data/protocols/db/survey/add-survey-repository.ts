import { AddSurveyDataModel } from '../../../../domain/usecases/add-survey'

export interface AddSurveyRepository {
  add: (surveyData: AddSurveyDataModel) => Promise<void>
}
