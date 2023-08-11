import { VercelRequest, VercelResponse } from '@vercel/node';
import { Db } from 'mongodb'
import { connectToDb } from '../lib/db';

module.exports = async (req: VercelRequest, res: VercelResponse) => {
    if(req.method === 'OPTIONS') { return res.status(200).json(({ body: "OK" })) }
    const db: Db | null = await connectToDb() || null;
    if (db) {
        const { username, outfit } = req.body;
        const collection = db.collection('user');
        const users = await collection.find({username}).toArray();
        if (!users.length) {
            res.send('该用户不存在');
        } else {
            collection.updateOne(
                { username: users[0].username },
                { $set: { outfit } }
            );
            res.send('更新成功');
        }
    }
}
