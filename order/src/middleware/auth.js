const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Token = require('../models/token');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')

        const payload = jwt.verify(token, process.env.JWT_KEY);
        const tokenDoc = await Token.findOne({ token, user: payload.id });
        if (!tokenDoc) {
          res.status(401).send('Token not found');
        }

        const user = await User.findById(payload.id)

        if( !user ) {
            res.status(401).send('Unauthenticated user');
        }

        req.token = token
        req.user = user
        next()
    } catch (e) {
        res
            .status(401)
            .send('Unauthenticated')
    }
}

module.exports = auth