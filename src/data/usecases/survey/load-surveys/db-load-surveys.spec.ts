import { LoadSurveysRepository, SurveyModel } from './db-load-surveys-protocols'
import { DbLoadSurveys } from './db-load-surveys'
import mockDate from 'mockdate'

describe('DbLoadSurveys Usecase', () => {
  beforeAll(() => {
    mockDate.set(new Date())
  })
  afterAll(() => {
    mockDate.reset()
  })
  test('should call LoadSurveysRepository', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut()
    const loadAllSpy = jest.spyOn(loadSurveysRepositoryStub, 'loadAll')
    await sut.load()
    expect(loadAllSpy).toHaveBeenCalled()
  })
  test('should return a list of surveys on success', async () => {
    const { sut } = makeSut()
    const surveys = await sut.load()
    expect(surveys).toEqual(makeFakeSurveys())
  })
  test('should throw if LoadSurveysRepository throws', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut()
    jest.spyOn(loadSurveysRepositoryStub, 'loadAll').mockRejectedValueOnce(new Error())
    await expect(sut.load).rejects.toThrow()
  })
})

interface SutTypes {
  sut: DbLoadSurveys
  loadSurveysRepositoryStub: LoadSurveysRepository
}

function makeSut (): SutTypes {
  const loadSurveysRepositoryStub = makeLoadSurveysRepository()
  const sut = new DbLoadSurveys(loadSurveysRepositoryStub)
  return { sut, loadSurveysRepositoryStub }
}

function makeLoadSurveysRepository (): LoadSurveysRepository {
  class LoadSurveysRepositoryStub implements LoadSurveysRepository {
    async loadAll (): Promise<SurveyModel[]> {
      return await Promise.resolve(makeFakeSurveys())
    }
  }
  return new LoadSurveysRepositoryStub()
}

function makeFakeSurveys (): SurveyModel[] {
  return [{
    id: 'any_id',
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }],
    date: new Date()
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
