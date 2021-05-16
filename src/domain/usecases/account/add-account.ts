import { AccountModel } from '@/domain/models/account'

export interface AddAccountParams {
  name: string
  email: string
  password: string
}

export interface AddAccount {
  add: (accountData: AddAccountParams) => Promise<AccountModel>
}
