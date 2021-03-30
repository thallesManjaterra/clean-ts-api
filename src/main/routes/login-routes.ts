import { Router } from 'express'
import { adaptRoute } from '../adapters/express/express-route-adapter'
import { makeSignUpController } from '../factories/signup/signup-factory'

export function signupRoutes (router: Router): void {
  router.post('/signup', adaptRoute(makeSignUpController()))
}
