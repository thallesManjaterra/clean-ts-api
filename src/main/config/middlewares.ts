import { Express } from 'express'
import { bodyParser, cors, contentType } from '../middlewares'

export default function setupMiddlewares (app: Express): void {
  app
    .use(bodyParser)
    .use(cors)
    .use(contentType)
}
