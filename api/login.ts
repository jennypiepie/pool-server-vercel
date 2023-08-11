import { VercelRequest, VercelResponse } from '@vercel/node';
import { Db } from 'mongodb'
import { connectToDb } from '../lib/db';

module.exports = async (req: VercelRequest, res: VercelResponse) => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(414).send('参数错误');
    }

    const db: Db | null = await connectToDb() || null;
    if (db) {
        // const username = 'pool';
        // const password = '12345';
        const collection = db.collection('user');
        const users = await collection.find({username}).toArray();
        if (!users.length) {
            res.status(404).send('该用户不存在');
        } else {
            if (password !== users[0].password) {
                res.status(414).send('密码错误');
            } else {
                res.status(200).json(users[0]);
            }
        }
    } else {
        res.status(502).send('数据库连接失败');
    }
}
