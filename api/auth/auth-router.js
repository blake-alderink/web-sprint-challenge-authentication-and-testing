const router = require('express').Router();
const bcrypt = require('bcryptjs');
const db = require('../../data/dbConfig')
const jwt = require('jsonwebtoken');


router.post('/register', async (req, res) => {

try {

  const exists = await db('users').where('username', req.body.username).first();

//if (exists) { return "this username is already taken"} otherwise continue onwards.

if (exists) {
  res.status(404).json({ message: "username taken"})
} 
else if (req.body.username && req.body.password) {

const hash = bcrypt.hashSync(req.body.password, 8);

const newUser = { username: req.body.username, password: hash }

await db('users').insert(newUser);

const returnObj = await db('users').where('username', req.body.username).first();

res.status(201).json(returnObj);



} else {
  res.status(404).json({message: "username and password required"})
}

}
catch (err) {
  res.status(404).json({message: "username and password required"})
}




  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.
    DO NOT EXCEED 2^8 ROUNDS OF HASHING!

    1- In order to register a new account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel", // must not exist already in the `users` table
        "password": "foobar"          // needs to be hashed before it's saved
      }

    2- On SUCCESSFUL registration,
      the response body should have `id`, `username` and `password`:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }

    3- On FAILED registration due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED registration due to the `username` being taken,
      the response body should include a string exactly as follows: "username taken".
  */
});

router.post('/login', async (req, res) => {


  try {

    const user = await db('users').where('username', req.body.username).first();
  
  //if (exists) { return "this username is already taken"} otherwise continue onwards.
  if (!req.body.password || !req.body.username) {
    res.status(404).json({
      message: 'username and password required'
    })
  } else 


  if (user && bcrypt.compareSync(req.body.password, user.password)) {

const token = generateToken(user);

    res.status(200).json({ message: `welcome, ${user.username}`, token: token})
  } else {
    res.status(404).json({message: "invalid credentials"})
  }



}

catch (err) {
  res.status(404).json({message: "username and password required"})
}


  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */
});

function generateToken(user) {
  const payload = {
    subject: user.id, // sub in payload is what the token is about
    username: user.username,
    // ...otherData
  };

  const options = {
    expiresIn: '1d', // show other available options in the library's documentation
  };

  // extract the secret away so it can be required and used where needed
  return jwt.sign(payload, 'shh', options); // this method is synchronous
}



module.exports = router;
