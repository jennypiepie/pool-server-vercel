import { Db, MongoClient, ServerApiVersion } from 'mongodb'

const uri = "mongodb+srv://jennypie:zjn20010314@cluster0.vqqlnds.mongodb.net/?retryWrites=true&w=majority";

let cachedDb: Db | null = null;

export const connectToDb = async () => {
    if (cachedDb) {
        return Promise.resolve(cachedDb);
    } else {
        return MongoClient.connect(uri, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        }).then(client => {
            cachedDb = client.db('pool');
            return cachedDb;
        }).catch(err => {
            console.log(err);
        })
    }
}
