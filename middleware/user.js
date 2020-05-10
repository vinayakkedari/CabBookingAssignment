const jsonwebtoken = require('jsonwebtoken');

function verifyToken(request, response, next) {

  // check header or url parameters or post parameters for token
  const token = request.headers['x-access-token'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jsonwebtoken.verify(token, process.env.TOKEN_SECRET, function (error, decoded) {

      if (error) {
        response.status(403).json({
          success: false,
          message: 'Failed to authenticate token.'
        });
        return;
      }

      // if everything is good, save to request for use in other routes
      request.decoded = decoded;

      next();
    });

  } else {

    // if there is no token
    // return an error
    response.status(403).json({
      success: false,
      message: 'No token provided.'
    });
  }
}

module.exports = verifyToken;