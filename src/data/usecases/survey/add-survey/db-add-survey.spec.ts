import { AddSurveyModel, AddSurveyRepository } from './db-add-survey-protocols'
import { DbAddSurvey } from './db-add-survey'
import mockDate from 'mockdate'

describe('DbAddSurvey Usecase', () => {
  beforeAll(() => {
    mockDate.set(new Date())
  })
  afterAll(() => {
    mockDate.reset()
  })
  test('should call AddSurveyRepository with correct values', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add')
    const surveyData = makeFakeSurveyData()
    await sut.add(surveyData)
    expect(addSpy).toHaveBeenCalledWith(surveyData)
  })
  test('should throw if AddSurveyRepository throws', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()
    jest.spyOn(addSurveyRepositoryStub, 'add').mockRejectedValueOnce(new Error())
    await expect(sut.add).rejects.toThrow()
  })
})

interface SutTypes {
  sut: DbAddSurvey
  addSurveyRepositoryStub: AddSurveyRepository
}

function makeSut (): SutTypes {
  const addSurveyRepositoryStub = makeAddSurveyRepository()
  const sut = new DbAddSurvey(addSurveyRepositoryStub)
  return { sut, addSurveyRepositoryStub }
}

function makeAddSurveyRepository (): AddSurveyRepository {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add (surveyData: AddSurveyModel): Promise<void> {
      return await Promise.resolve()
    }
  }
  return new AddSurveyRepositoryStub()
}

function makeFakeSurveyData (): AddSurveyModel {
  return {
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }],
    date: new Date()
  }
}
