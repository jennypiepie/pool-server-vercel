import { VercelRequest, VercelResponse } from '@vercel/node';
import { Db } from 'mongodb'
import { connectToDb } from '../lib/db';
const jwt = require('jsonwebtoken');

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
                const token = jwt.sign(
                    { username, password }, //  携带信息(根据username和password生成的密文)
                    'jennypie',     //秘钥
                    { expiresIn: 24 * 60 *60 * 1000 }   //有效期
                );
                collection.updateOne(
                    { username },
                    { $set: { token } }
                );
                const result = Object.assign(users[0],{token,message:"登录成功"})
                res.json(result);
            }
        }
    } else {
        res.json({message:'数据库连接失败'});
    }
}
