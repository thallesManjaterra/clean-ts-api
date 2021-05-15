import { Express, Router } from 'express'
import { loginRoutes } from '../routes/login-routes'
import { surveyResultRoutes } from '../routes/survey-result-routes'
import { surveyRoutes } from '../routes/survey-routes'

export default function setupRoutes (app: Express): void {
  const router = Router()
  app.use('/api', router)
  loginRoutes(router)
  surveyRoutes(router)
  surveyResultRoutes(router)
}
