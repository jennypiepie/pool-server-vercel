import { VercelRequest, VercelResponse } from '@vercel/node';
import { Db } from 'mongodb'
import { connectToDb } from '../lib/db';


module.exports = async (req: VercelRequest, res: VercelResponse) => {
  const db: Db | null = await connectToDb() || null;
  if (db) {
    const collection = db.collection('exhibits');
    const exhibits = await collection.find({}).toArray();
    res.status(200).json(exhibits);
  }
}
