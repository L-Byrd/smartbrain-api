//not an es6 module using experimental modules in start script 
//allows commonjs modules to be written as es6 modules
import Clarifai from 'clarifai';

const app = new Clarifai.App({
    apiKey: process.env.API_KEY
});

export const handleApiCall = (req, res)  => {
    app.models
        .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
        .then(data => {
          res.json(data);
        })
        .catch(err => res.status(400).json('unable to work with API'));
};

export const handleImage = (db) => (req, res) => {
    const { id } = req.body;
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0]);
    })
    .catch(err => res.status(400).json('unable to get entries'))
};
