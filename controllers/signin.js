import { createSession, getAuthTokenId  } from '../tokens/token.js';

const handleSignIn =  (db, bcrypt, req, res) => {
    const{email, password} = req.body; 
    if(!email || !password){
        return Promise.reject('Incorrect form submission');
    }
    return db.select('email', 'hash').from('login')
    .where('email', '=', email)
    .then(data => {
        const isValid = bcrypt.compareSync(password, data[0].hash);
        if(isValid){
            return db.select('*').from('users')
            .where('email', '=', email)
            .then(user => user[0])
            .catch(err => Promise.reject('Unable to get user'))
        }else{
             Promise.reject('Wrong credentials');
        }
    }) 
    .catch(err => Promise.reject('Wrong credentials'))
 };

const signInAuthentication = (db , bcrypt) => (req, res) => {
    const { authorization } = req.headers; 
    return authorization ? 
    getAuthTokenId(req, res) : 
    handleSignIn(db, bcrypt, req, res)
    .then(data => {
       return data.id && data.email ?
        createSession(data) : Promise.reject(data)
    })
    .then(session => res.json(session))
    .catch(err => res.status(400).json(err));
}

export default signInAuthentication;