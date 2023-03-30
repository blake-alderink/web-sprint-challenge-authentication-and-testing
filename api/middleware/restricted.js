const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {

const token = req.headers.authorization; 

if (token) {

    jwt.verify(token, "shh", (err, decoded) => {
      if (err) {
       return res.status(404).json({message: "token invalid"})
        // const returnObj = {message: 'token invalid'}
        // req.invalidToken = returnObj;
        // // console.log('there was an error in the decode');
        // console.log(returnObj);
        // next(req.invalidToken)
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
