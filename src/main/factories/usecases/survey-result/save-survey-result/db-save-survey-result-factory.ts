import { DbSaveSurveyResult } from '@/data/usecases/survey-result/save-survey-result/db-save-survey-result'
import { SaveSurveyResult } from '@/domain/usecases/survey-result/save-survey-result'
import { SurveyResultMongoRepository } from '@/infra/db/mongodb/survey-result/survey-result-mongo-repository'

export function makeDbsaveSurveyResult (): SaveSurveyResult {
  const surveyResultMongoRepository = new SurveyResultMongoRepository()
  const dbSaveSurveyResult = new DbSaveSurveyResult(surveyResultMongoRepository)
  return dbSaveSurveyResult
}
