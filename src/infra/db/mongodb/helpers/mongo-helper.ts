import { Collection, MongoClient } from 'mongodb'

export const MongoHelper = {
  client: null as MongoClient,
  async connect (uri: string) {
    this.client = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  },
  async disconnect () {
    this.client.close()
  },
  getCollection (collectionName: string): Collection {
    return this.client.db().collection(collectionName)
  },
  formatId (data: any) {
    const { _id: id, ...dataWithoutId } = data
    return { id, ...dataWithoutId }
  }
}
