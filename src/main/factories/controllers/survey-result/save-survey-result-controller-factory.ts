import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory'
import { SaveSurveyResultController } from '@/presentation/controllers/survey-result/save-survey-result/save-survey-result-controller'
import { Controller } from '@/presentation/protocols'
import { makeDbsaveSurveyResult } from '../../usecases/survey-result/save-survey-result/db-save-survey-result-factory'
import { makeDbLoadSurveyById } from '../../usecases/survey/load-survey-by-id/db-load-survey-by-id-factory'

export function makeSaveSurveyResultController (): Controller {
  const saveSurveyResultController = new SaveSurveyResultController(makeDbLoadSurveyById(), makeDbsaveSurveyResult())
  return makeLogControllerDecorator(saveSurveyResultController)
}
