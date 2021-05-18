import { AddSurveyParams } from '@/data/usecases/survey/add-survey/db-add-survey-protocols'
import { SurveyModel } from '@/data/usecases/survey/load-survey-by-id/db-load-survey-by-id-protocols'

export function mockSurveyData (): AddSurveyParams {
  return {
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }, {
      answer: 'another_answer'
    }],
    date: new Date()
  }
}

export function mockSurveyModel (): SurveyModel {
  return {
    id: 'any_id',
    ...mockSurveyData()
  }
}

export function mockSurveyModels (): SurveyModel[] {
  return [{
    id: 'any_id',
    ...mockSurveyData()
  }, {
    id: 'another_id',
    question: 'another_question',
    answers: [{
      image: 'another_image',
      answer: 'another_answer'
    }],
    date: new Date()
  }]
}
