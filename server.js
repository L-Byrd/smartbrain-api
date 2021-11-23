//express server
import express, { json } from 'express';
//used for hashing and salting passwords
import bcrypt from 'bcrypt';
//cross origin resource sharing
import cors from 'cors';
//import the controllers
import handleRegister from './controllers/register.js'
import handleSignIn from './controllers/signin.js';
import { handleImage, handleApiCall } from './controllers/image.js';
import handleProfileGet from './controllers/profile.js';
//sql querybuilder for relational databases
import knex from 'knex'; 
//compression
import compression from 'compression';
import morgan from 'morgan';
//connection to local server
const db = knex({
    client: 'pg',
    connection: process.env.POSTGRES_URI
  });
//show all user data from users table
db.select('*').from('users').then(data =>{
    console.log(data);
});

const app = express();

app.use(json());
app.use(cors());
app.use(compression());
app.use(morgan('combined'));

app.post('/signin', handleSignIn( db, bcrypt));
app.post('/register', handleRegister(db, bcrypt));
app.get('/profile/:id', handleProfileGet(db));
app.put('/image', handleImage(db));
app.post('/imageurl',handleApiCall);

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