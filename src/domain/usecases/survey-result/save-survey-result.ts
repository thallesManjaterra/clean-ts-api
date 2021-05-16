import { SurveyResultModel } from '../../models/survey-result'

export interface SaveSurveyResultParams {
  surveyId: string
  accountId: string
  answer: string
  date: Date
}

export interface SaveSurveyResult {
  save: (surveyResultData: SaveSurveyResultParams) => Promise<SurveyResultModel>
}
