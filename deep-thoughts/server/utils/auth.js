// import jwt
const jwt = require('jsonwebtoken');

// create a secret as required by jwt
const secret = 'mysecretshhhhh';

// create an expiration date as required by jwt
const expiration = '2h';

// export the signToken function
module.exports = {
    
    // signToken takes in username, email, _id as parameters
    signToken: function({ username, email, _id }) {

        // the payload is the parameters in one variable
        const payload = { username, email, _id };

        // returns the jwt.sign method with the required information
        return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
    },

    authMiddleware: function({ req }) {

        // allows token to be sent via req.body, req.query, or headers
        let token = req.body.token || req.query.token || req.headers.authorization;

        // separate "Bearer" from "<tokenvalue>"
        if (req.headers.authorization) {
            token = token
            .split(' ')
            .pop()
            .trim();
        }

        // if no token, return request object as is
        if (!token) {
            return req;
        }

        try {
            // decode and attach user data to request object
            const { data } = jwt.verify(token, secret, { maxAge: expiration });
            req.user = data;
        } catch {
            console.log('Invalid token');
        }

        // return updated request object
        return req;
    }
};