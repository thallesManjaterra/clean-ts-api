import { AccountModel, AddAccountParams } from '@/data/usecases/account/add-account/db-add-account-protocols'
import { AuthenticationParams } from '@/data/usecases/account/authentication/db-authentication-protocols'

export function mockAddAccountParams (): AddAccountParams {
  return {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password'
  }
}

export function mockAccountModel (): AccountModel {
  return {
    id: 'any_id',
    ...mockAddAccountParams()
  }
}

export function mockFakeauthenticationParams (): AuthenticationParams {
  return {
    email: 'any_email@mail.com',
    password: 'any_passsword'
  }
}
