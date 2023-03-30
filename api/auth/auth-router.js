const router = require('express').Router();
const bcrypt = require('bcryptjs');
const db = require('../../data/dbConfig')


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
  res.status(500).json({message: err.message})
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

router.post('/login', (req, res) => {
  res.end('implement login, please!');
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

module.exports = router;
