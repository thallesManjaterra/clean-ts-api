import { SurveyAnswerModel } from '@/domain/models/survey'

export interface AddSurveyParams {
  question: string
  answers: SurveyAnswerModel[]
  date: Date
}

export interface AddSurvey {
  add: (surveyData: AddSurveyParams) => Promise<void>
}
