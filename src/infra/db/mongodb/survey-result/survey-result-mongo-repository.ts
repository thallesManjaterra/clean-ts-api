import { SaveSurveyResultRepository } from '@/data/protocols/db/survey-result/save-survey-result-repository'
import { SurveyResultModel } from '@/domain/models/survey-result'
import { SaveSurveyResultParams } from '@/domain/usecases/survey-result/save-survey-result'
import { MongoHelper } from '../helpers/mongo-helper'

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
  async save (surveyResultData: SaveSurveyResultParams): Promise<SurveyResultModel> {
    const surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    const { accountId, surveyId, answer, date } = surveyResultData
    const { value: surveyResult } = await surveyResultCollection.findOneAndUpdate(
      { accountId, surveyId },
      { $set: { answer, date } },
      { upsert: true, returnOriginal: false }
    )
    return surveyResult && MongoHelper.formatId(surveyResult)
  }
}
