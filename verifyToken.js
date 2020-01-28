const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config();
const verifyToken = async (req, res, _id, name, email, next) => {

    const token = req.cookies.token || '';
    try {
        if (!token) {
            return res.status(401).json('You need to Login')
        }
        const decrypt = await jwt.verify(_id, name, email, token, process.env.TOKEN_SECRET);
        req.user = {
            _id: decrypt._id,
            name: decrypt.name,
            email: decrypt.email
        };
        next();
    } catch (err) {
        return res.status(500).json(err.toString());
    }

};

module.exports = verifyToken;

