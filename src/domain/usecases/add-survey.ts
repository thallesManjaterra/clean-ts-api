export interface SurveyAnswer {
  image: string
  answer: string
}

export interface AddSurveyDataModel {
  question: string
  answers: SurveyAnswer[]
}

export interface AddSurvey {
  add: (data: AddSurveyDataModel) => Promise<void>
}
