import { VercelRequest, VercelResponse } from '@vercel/node';
import { Db } from 'mongodb'
import { connectToDb } from '../lib/db';

module.exports = async (req: VercelRequest, res: VercelResponse) => {
    if (req.method === 'OPTIONS') { return res.json(({ body: "OK" })) }
    const db: Db | null = await connectToDb() || null;
    if (db) {
        const { name } = req.body;
        const collection = db.collection('photos');
        await collection.deleteOne({ name });
        res.json({ message: '删除成功' });
    }
}
