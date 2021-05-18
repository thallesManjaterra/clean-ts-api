import { AccountModel } from '@/domain/models/account'
import { mockAccountModel } from '@/domain/test'
import { AddAccount, AddAccountParams } from '@/domain/usecases/account/add-account'
import { Authentication, AuthenticationParams } from '@/domain/usecases/account/authentication'
import { LoadAccountByToken } from '@/domain/usecases/account/load-account-by-token'

export function mockAddAccount (): AddAccount {
  class AddAccountStub implements AddAccount {
    async add (_accountData: AddAccountParams): Promise<AccountModel> {
      return await Promise.resolve(mockAccountModel())
    }
  }
  return new AddAccountStub()
}

export function mockAuthentication (): Authentication {
  class AuthenticationStub implements Authentication {
    async auth (_authenticationParams: AuthenticationParams): Promise<string> {
      return await Promise.resolve(mockAccessToken())
    }
  }
  return new AuthenticationStub()
}

export function mockAccessToken (): string {
  return 'any_token'
}

export function mockLoadAccountByToken (): LoadAccountByToken {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load (accessToken: string, role?: string): Promise<AccountModel> {
      return await Promise.resolve(mockAccountModel())
    }
  }
  return new LoadAccountByTokenStub()
}
