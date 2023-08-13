import { VercelRequest, VercelResponse } from '@vercel/node';
import { Db } from 'mongodb'
import { connectToDb } from '../lib/db';

module.exports = async (req: VercelRequest, res: VercelResponse) => {
    if(req.method === 'OPTIONS') { return res.json(({ body: "OK" })) }
    const db: Db | null = await connectToDb() || null;
    if (db) {
        const { username } = req.body;
        const collection = db.collection('user');
        const count = await collection.countDocuments({ username });
        if (count>0) {
            res.json({message:'该用户已存在'});
        } else {
            await collection.insertOne(Object.assign(req.body,{outfit:'Waitress,White'}));
            res.json({message:'注册成功'});
        }
    }
}
