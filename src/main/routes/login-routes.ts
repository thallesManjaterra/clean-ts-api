import { Router } from 'express'
import { adaptRoute } from '../adapters/express-route-adapter'
import { makeLoginController } from '../factories/controllers/login-stuff/login/login-controller-factory'
import { makeSignUpController } from '../factories/controllers/login-stuff/signup/signup-controller-factory'

export function loginRoutes (router: Router): void {
  router
    .post('/signup', adaptRoute(makeSignUpController()))
    .post('/login', adaptRoute(makeLoginController()))
}
