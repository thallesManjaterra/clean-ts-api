export interface AuthenticationDataModel {
  email: string
  password: string
}

export interface Authentication {
  auth: (authenticationData: AuthenticationDataModel) => Promise<string>
}
