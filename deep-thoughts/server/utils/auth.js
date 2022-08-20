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
    }
};