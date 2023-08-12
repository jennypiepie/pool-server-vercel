import { VercelRequest, VercelResponse } from '@vercel/node';
import { Db } from 'mongodb'
import { connectToDb } from '../lib/db';


module.exports = async (req: VercelRequest, res: VercelResponse) => {
  if (req.method === 'OPTIONS') { return res.json(({ body: "OK" })) }
  const { username } = req.body || {};
  
  const db: Db | null = await connectToDb() || null;
  if (db) {
    const collection = db.collection('exhibits');
    const exhibits = username ?
      await collection.find({ likes: username }).toArray() :
      await collection.find({}).toArray();
    res.json(exhibits);
  }
}
