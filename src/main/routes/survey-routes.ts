import { Router } from 'express'
import { adaptRoute } from '../adapters/express/express-route-adapter'
import { makeAddSurveyController } from '../factories/controllers/add-survey/add-survey-controller-factory'

export function surveyRoutes (router: Router): void {
  router
    .post('/surveys', adaptRoute(makeAddSurveyController()))
}
