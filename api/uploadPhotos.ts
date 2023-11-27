import { VercelRequest, VercelResponse } from '@vercel/node';
import { Db } from 'mongodb'
import { connectToDb } from '../lib/db';

module.exports = async (req: VercelRequest, res: VercelResponse) => {
    if (req.method === 'OPTIONS') { return res.json(({ body: "OK" })) }
    const db: Db | null = await connectToDb() || null;
    if (db) {
        const { username, base64 } = req.body;
        const collection = db.collection('photos');
        await collection.insertOne({ base64, user: username });
        res.json({ message: '添加成功' });
    }
}
