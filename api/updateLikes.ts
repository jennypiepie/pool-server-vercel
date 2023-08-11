import { VercelRequest, VercelResponse } from '@vercel/node';
import { Db } from 'mongodb'
import { connectToDb } from '../lib/db';


module.exports = async (req: VercelRequest, res: VercelResponse) => {
  if(req.method === 'OPTIONS') { return res.status(200).json(({ body: "OK" })) }
  const db: Db | null = await connectToDb() || null;
    if (db) {
        const { exhibitsName, userName } = req.body;
        const collection = db.collection('exhibits');
        const exhibits = await collection.find({ name: exhibitsName }).toArray();
        const likes = exhibits[0].likes;
        const index = likes.findIndex(i => i === userName);
        index === -1 ? likes.push(userName) : likes.splice(index, 1);
        collection.updateOne(
            { name: exhibitsName },
            { $set: { likes } }
        );
        res.send('更新成功');
  }
}
