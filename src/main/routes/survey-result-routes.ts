import { Router } from 'express'
import { adaptRoute } from '../adapters/express-route-adapter'
import { makeSaveSurveyResultController } from '../factories/controllers/survey-result/save-survey-result-controller-factory'
import { auth } from '../middlewares/auth'

export function surveyResultRoutes (router: Router): void {
  router
    .put('/surveys/:surveyId/results', auth, adaptRoute(makeSaveSurveyResultController()))
}
