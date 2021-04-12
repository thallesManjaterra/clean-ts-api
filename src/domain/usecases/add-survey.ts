import { SurveyAnswer } from '../models/survey'

export interface AddSurveyDataModel {
  question: string
  answers: SurveyAnswer[]
  date: Date
}

export interface AddSurvey {
  add: (surveyData: AddSurveyDataModel) => Promise<void>
}
