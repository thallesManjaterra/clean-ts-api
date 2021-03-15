import { Express } from 'express'
import { bodyParser } from '../middlewares/body-parser'
import { cors } from '../middlewares/cors'

export default function setupMiddlewares (app: Express): void {
  app
    .use(bodyParser)
    .use(cors)
}
