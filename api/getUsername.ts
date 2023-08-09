import { VercelRequest, VercelResponse } from '@vercel/node';
import { MongoClient, ServerApiVersion } from 'mongodb'

const uri = "mongodb+srv://jennypie:zjn20010314@cluster0.vqqlnds.mongodb.net/?retryWrites=true&w=majority";


module.exports = async (req: VercelRequest, res: VercelResponse) => {
  const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
  });

  try {
    await client.connect();
    const db = await client.db('pool');
    var result = await db.collection('user').find({}).toArray();
    // console.log(client)
    // console.log(db)
    // console.log(result)
    res.status(200).json(result);
  } finally {
    await client.close();
  }
}
