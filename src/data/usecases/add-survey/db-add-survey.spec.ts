import { AddSurveyModel, AddSurveyRepository } from './db-add-survey-protocols'
import { DbAddSurvey } from './db-add-survey'

describe('DbAddSurvey Usecase', () => {
  test('should call AddSurveyRepository with correct values', async () => {
    class AddSurveyRepositoryStub implements AddSurveyRepository {
      async add (surveyData: AddSurveyModel): Promise<void> {
        return await Promise.resolve()
      }
    }
    const addSurveyReposistoryStub = new AddSurveyRepositoryStub()
    const sut = new DbAddSurvey(addSurveyReposistoryStub)
    const addSpy = jest.spyOn(addSurveyReposistoryStub, 'add')
    const surveyData = makeFakeSurveyData()
    await sut.add(surveyData)
    expect(addSpy).toHaveBeenCalledWith(surveyData)
  })
})

function makeFakeSurveyData (): AddSurveyModel {
  return {
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }]
  }
}
