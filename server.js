//express server
import express, { json, urlencoded } from 'express';
//used for hashing and salting passwords
import bcrypt from 'bcrypt';
//cross origin resource sharing
import cors from 'cors';
//helmet security middleware
import helmet from 'helmet';
//ssl
import enforce from 'express-sslify';
//import the controllers
import handleRegister from './controllers/register.js'
import signInAuthentication from './controllers/signin.js';
import { handleImage, handleApiCall } from './controllers/image.js';
import { handleProfileGet, handleProfileUpdate } from './controllers/profile.js';
//sql querybuilder for relational databases
import knex from 'knex'; 
//compression
import compression from 'compression';
import morgan from 'morgan';
import requireAuth from './middleware/authorization.js';
//connection to local server
const db = knex({
    client: 'pg',
    connection: process.env.POSTGRES_URI
  });
//show all user data from users table
// db.select('*').from('users').then(data =>{
//     console.log(data);
// });

const app = express();

app.use(json());
app.use(urlencoded({extended: true}));
app.use(enforce.HTTPS({trustProtoHeader: true}));
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));

app.post('/signin', signInAuthentication( db, bcrypt));
app.post('/register', handleRegister(db, bcrypt));
app.get('/profile/:id', requireAuth, handleProfileGet(db));
app.post('/profile/:id', requireAuth, handleProfileUpdate(db));
app.put('/image', requireAuth, handleImage(db));
app.post('/imageurl', requireAuth, handleApiCall);

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`app is running on port ${PORT}`);
});
/*
/ --> res = this is working 
/signin --> POST = success/fail
/register --> POST = user object returned
/profile/:userId --> GET = user
/image --> PUT --> user
*/