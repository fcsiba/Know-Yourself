const jwt = require('jsonwebtoken');
const k = require('../config.json');

module.exports = {
    sign: (uid) => {
        var signOptions = {
            expiresIn: 86400
        }
        return jwt.sign({uid},k.jwt_key,signOptions);
    },
    verify: (token) => {
        var verifyOptions = {
            expiresIn: 86400
        }
        try{
            return jwt.verify(token, k.jwt_key, verifyOptions);
        } catch (err) {
            return false;
        }
    },
    decode: (token) => {
        return jwt.decode(token, {complete: true});
    }
}