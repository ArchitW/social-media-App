const jwt = require('jsonwebtoken');
//import jwt from 'jsonwebtoken'; 

const generateToken = (res, _id, name, email) => {
    const expiration = process.env.DB_ENV === 'testing' ? 100 : 604800000;
    const token = jwt.sign({ _id, name, email }, process.env.TOKEN_SECRET, {
        expiresIn: process.env.DB_ENV === 'testing' ? '1d' : '7d',
    });
    return res.cookie('access_token', token, {
        expires: new Date(Date.now() + expiration),
        secure: false, // set to true if your using https
        httpOnly: true,
    });

};
module.exports = generateToken