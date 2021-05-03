import { Router } from 'express'
import { adaptRoute } from '../adapters/express-route-adapter'
import { makeAddSurveyController } from '../factories/controllers/survey/add-survey/add-survey-controller-factory'
import { makeLoadSurveysController } from '../factories/controllers/survey/load-surveys/load-surveys-controller-factory'
import { adminAuth } from '../middlewares/admin-auth'
import { auth } from '../middlewares/auth'

export function surveyRoutes (router: Router): void {
  router
    .post('/surveys', adminAuth, adaptRoute(makeAddSurveyController()))
    .get('/surveys', auth, adaptRoute(makeLoadSurveysController()))
}
