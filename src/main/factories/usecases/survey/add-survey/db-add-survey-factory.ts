import { DbAddSurvey } from '../../../../../data/usecases/survey/add-survey/db-add-survey'
import { AddSurvey } from '../../../../../domain/usecases/add-survey'
import { SurveyMongoRepository } from '../../../../../infra/db/mongodb/survey/survey-mongo-repository'

export function makeDbAddSurvey (): AddSurvey {
  const surveyMongoRepository = new SurveyMongoRepository()
  const dbAddAccount = new DbAddSurvey(surveyMongoRepository)
  return dbAddAccount
}
