import jwt from 'jsonwebtoken';
import redisClient from '../redisclient/redisClient.js';

export const getAuthTokenId = (req, res) => {
    const { authorization } = req.headers;
    return redisClient.get(authorization, (err, reply) => {
        if(err || !reply){
            return res.status(401).send('Unauthorized');
        }
        return res.json({id: reply})
    })
} 

export const createSession = (user) => {
    //JWT token, return user data
    const { email, id } = user;
    const token = signToken(email);
    return setToken(`Bearer ${token}`, id)
        .then(() => { 
            return { success: true, userId: id, token, user }
        })
        .catch(err => console.log(err))
}

const signToken = (email) => {
    const jwtPayload = { email };
    return jwt.sign(jwtPayload, process.env.JWT_SECRET_KEY, { expiresIn: '2 days' });
}

const setToken = (key, value) => Promise.resolve(redisClient.set(key, value));