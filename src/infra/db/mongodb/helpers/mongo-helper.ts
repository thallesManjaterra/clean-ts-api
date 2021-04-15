import { Collection, MongoClient } from 'mongodb'

export const MongoHelper = {
  client: null as MongoClient,
  uri: null as string,
  async connect (uri: string) {
    this.uri = uri
    this.client = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  },
  async disconnect () {
    this.client.close()
    this.client = null
  },
  async getCollection (collectionName: string): Promise<Collection> {
    if (!this.client?.isConnected()) {
      await this.connect(this.uri)
    }
    return this.client.db().collection(collectionName)
  },
  formatId (data: any) {
    const { _id, ...dataWithoutId } = data
    const id = _id
    delete data._id
    return { id, ...dataWithoutId }
  }
}
