import { SaveSurveyResultParams, SurveyResultModel } from '@/data/usecases/survey-result/save-survey-result/db-save-survey-result-protocols'

export function mockSurveyResultData (): SaveSurveyResultParams {
  return {
    surveyId: 'any_survey_id',
    accountId: 'any_account_id',
    answer: 'any_answer',
    date: new Date()
  }
}

export function mockSurveyResultModel (): SurveyResultModel {
  return {
    id: 'any_id',
    ...mockSurveyResultData()
  }
}
