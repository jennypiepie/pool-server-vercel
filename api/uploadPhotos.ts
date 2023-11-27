import { VercelRequest, VercelResponse } from '@vercel/node';
import { Db } from 'mongodb'
import { connectToDb } from '../lib/db';

module.exports = async (req: VercelRequest, res: VercelResponse) => {
    if (req.method === 'OPTIONS') { return res.json(({ body: "OK" })) }
    const db: Db | null = await connectToDb() || null;
    if (db) {
        const { username, base64 } = req.body;
        const collection = db.collection('photos');
        collection.insertOne({ base64, user: username });
    }
}
