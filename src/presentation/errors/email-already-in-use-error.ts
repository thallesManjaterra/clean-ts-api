export class EmailAlreadyInUseError extends Error {
  constructor () {
    super('The receive email is already in use')
    this.name = 'EmailAlreadyInUseError'
  }
}
