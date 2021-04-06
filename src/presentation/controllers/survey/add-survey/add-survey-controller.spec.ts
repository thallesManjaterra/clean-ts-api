import { AddSurveyController } from './add-survey-controller'
import { HttpRequest, Validation } from './add-survey-controller-protocols'

describe('AddSurvey Controller', () => {
  test('should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })
})

interface SutTypes {
  sut: AddSurveyController
  validationStub: Validation
}

function makeSut (): SutTypes {
  const validationStub = makeValidation()
  const sut = new AddSurveyController(validationStub)
  return { sut, validationStub }
}

function makeValidation (): Validation {
  class ValidationStub implements Validation {
    validate (_input: any): Error {
      return null
    }
  }
  return new ValidationStub()
}

function makeFakeRequest (): HttpRequest {
  return {
    body: {
      question: 'any_question',
      answers: [
        {
          image: 'any_image',
          answer: 'any_answer'
        }
      ]
    }
  }
}
