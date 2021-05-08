import mockDate from 'mockdate'
import { DbLoadSurveyById } from './db-load-survey-by-id'
import { LoadSurveyByIdRepository, SurveyModel } from './db-load-survey-by-id-protocols'

describe('DbLoadSurveys Usecase', () => {
  beforeAll(() => {
    mockDate.set(new Date())
  })
  afterAll(() => {
    mockDate.reset()
  })
  test('should call LoadSurveyByIdRepository with correct id', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById')
    await sut.loadById('any_survey_id')
    expect(loadByIdSpy).toHaveBeenCalledWith('any_survey_id')
  })
})

interface SutTypes {
  sut: DbLoadSurveyById
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository
}

function makeSut (): SutTypes {
  const loadSurveyByIdRepositoryStub = makeLoadSurveyByIdRepository()
  const sut = new DbLoadSurveyById(loadSurveyByIdRepositoryStub)
  return { sut, loadSurveyByIdRepositoryStub }
}

function makeLoadSurveyByIdRepository (): LoadSurveyByIdRepository {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    async loadById (id: string): Promise<SurveyModel> {
      return await Promise.resolve(makeFakeSurvey())
    }
  }
  return new LoadSurveyByIdRepositoryStub()
}

function makeFakeSurvey (): SurveyModel {
  return {
    id: 'any_id',
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }],
    date: new Date()
  }
}
