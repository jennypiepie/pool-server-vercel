import { VercelRequest, VercelResponse } from '@vercel/node';
import { Db } from 'mongodb'
import { connectToDb } from '../lib/db';

module.exports = async (req: VercelRequest, res: VercelResponse) => {
    if(req.method === 'OPTIONS') { return res.status(200).json(({ body: "OK" })) }
    const { username, password } = req.body;
    if (!username || !password) {
        res.json({message:'参数错误'});
    }

    const db: Db | null = await connectToDb() || null;
    if (db) {
        const collection = db.collection('user');
        const users = await collection.find({username}).toArray();
        if (!users.length) {
            res.json({message:'该用户不存在'});
        } else {
            if (password !== users[0].password) {
                res.json({message:'密码错误'});
            } else {
                const result = Object.assign(users[0],{message:"登录成功"})
                res.status(200).json(result);
            }
        }
    } else {
        res.json({message:'数据库连接失败'});
    }
}
