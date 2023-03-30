const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {

const token = req.headers.authorization; 

if (token) {

    jwt.verify(token, "shh", (err, decoded) => {
      if (err) {
        
        // console.log('there was an error in the decode');
        next({message: "token invalid"})
      } else {
        
        next()
      }
    })

} else {
  res.status(404).json({message: "token required"})
}



  /*
    IMPLEMENT

    1- On valid token in the Authorization header, call next.

    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".

    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */
};
