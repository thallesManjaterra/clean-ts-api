import { LoadSurveysController } from '../../../../../presentation/controllers/survey/load-surveys/load-surveys-controller'
import { Controller } from '../../../../../presentation/protocols'
import { makeLogControllerDecorator } from '../../../decorators/log-controller-decorator-factory'
import { makeDbLoadSurveys } from '../../../usecases/load-surveys/db-load-surveys-factory'

export function makeLoadSurveysController (): Controller {
  return makeLogControllerDecorator(
    new LoadSurveysController(makeDbLoadSurveys())
  )
}
