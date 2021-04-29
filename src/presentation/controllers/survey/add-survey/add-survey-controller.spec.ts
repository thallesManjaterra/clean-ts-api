import { HttpRequest } from './add-survey-protocols'
import { AddSurveyController } from './add-survey-controller'
import { Validation } from '../../../protocols'

describe('AddsurveyController', () => {
  test('should call Validation with correct values', async () => {
    class ValidationStub implements Validation {
      validate (input: any): Error {
        return null
      }
    }
    const validationStub = new ValidationStub()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const sut = new AddSurveyController(validationStub)
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })
})

function makeFakeRequest (): HttpRequest {
  return {
    body: {
      question: 'any_question',
      answers: [{
        image: 'any_image',
        answer: 'any_answer'
      }]
    }
  }
}
