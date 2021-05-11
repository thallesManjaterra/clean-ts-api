export interface HttpRequest {
  body?: any
  headers?: any
  params?: any
  accountId?: string
}

export interface HttpResponse {
  statusCode: number
  body: any
}
