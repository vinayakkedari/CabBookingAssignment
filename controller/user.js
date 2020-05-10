const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const User = require('./../models/user');

function authenticateUser(request, response) {

  // find the user
  User.findOne({
    email: request.body.email
  }, function (error, user) {

    if (error) {
      response.status(500).json({
        success: false,
        message: 'Internal server error'
      });
      throw error;
    }

    if (!user) {
      response.status(401).json({
        success: false,
        message: 'Authentication failed. User not found.'
      });
      return;
    }

    bcrypt.compare(request.body.password, user.password, function (error, result) {

      if (error) {
        response.status(500).json({
          success: false,
          message: 'Internal server error'
        });
        throw error;
      }

      if (!result) {
        response.status(401).json({
          success: false,
          message: 'Authentication failed. Wrong password.'
        });
        return;
      }

      // if user is found and password is right
      // create a token
      const token = jsonwebtoken.sign({ email: user.email, id: user._id }, process.env.TOKEN_SECRET, {
        expiresIn: process.env.TOKEN_EXPIRES
      });

      // return the information including token as JSON
      response.json({
        success: true,
        token: token
      });

    });
  });
};

function getTokenPayload(request) {
  let payload = null;

  // check header or url parameters or post parameters for token
  const token = request.headers['x-access-token']; 1

  if (token) {
    payload = jsonwebtoken.decode(token, { complete: true }).payload;
  }

  return payload;
}

function getUsernameFromToken(request) {
  return new Promise((resolve, reject) => {
    let payload = getTokenPayload(request);

    if (payload) {
      resolve(payload.id);
    }

    resolve(null);
  })

}


module.exports = {
  authenticateUser: authenticateUser,
  getUsernameFromToken: getUsernameFromToken
};
