import { DbLoadSurveys } from '@/data/usecases/survey/load-surveys/db-load-surveys'
import { LoadSurveys } from '@/domain/usecases/load-surveys'
import { SurveyMongoRepository } from '@/infra/db/mongodb/survey/survey-mongo-repository'

export function makeDbLoadSurveys (): LoadSurveys {
  const surveyMongoRepository = new SurveyMongoRepository()
  const dbLoadSurveys = new DbLoadSurveys(surveyMongoRepository)
  return dbLoadSurveys
}
