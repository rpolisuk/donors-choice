const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const validator = require('validator');
const sgMail = require('@sendgrid/mail');
const config = require('../config');
const md5 = require('md5');
const authenticate = require('../authenticate');

/* Sample JSON POST /users/signup request:
{
    "firstname": "richard",
    "lastname": "polisuk",
    "username": "polisuk@hotmail.com",
    "password": "hello"
}
*/
router.post('/signup', (req, res, next) => {
  res.setHeader('Content-Type', 'application/json'); // All returns are in JSON format

  // Validate email address
  if (!validator.isEmail(req.body.username)) {
    res.statusCode = 422;
    res.json({
      success: false,
      status: 'Email is invalid'
    });
    return;
  }

  // Call Passport-local-mongoose register method to register a new user
  User.register(
    new User({ username: req.body.username, firstname: req.body.firstname, lastname: req.body.lastname }),
    req.body.password,
    (err, user) => {
      if (err) {
        res.statusCode = 422;
        res.json({
          success: false,
          err: err
        });
      } else {
        user.save((err, user) => {
          if (err) {
            res.statusCode = 500;
            res.json({
              success: false,
              err: err
            });
            return;
          }
          passport.authenticate('local')(req, res, () => {
            res.statusCode = 200;
            res.json({
              success: true,
              status: 'Registration Successful!'
            });
          });
        });
      }
    });

  // Send confirmation email with verification link
  sgMail.setApiKey(config.SENDGRID_API_KEY);
  const md5UserID = md5(req.body.username);
  const msg = {
    to: `${req.body.username}`,
    from: 'rpolisuk@myseneca.ca', // Use the email address or domain you verified above
    subject: 'Welcome to Donors Choice',
    html: `<p>Click the following link to verify: <a href="http://localhost:3000/users/verify?email=${req.body.username}&code=${md5UserID}"> http://localhost:3000/users/verify?email=${req.body.username}&code=${md5UserID} </a></p>`
  };
  sgMail
    .send(msg)
    .then((response) => {
      console.log(response[0].statusCode);
      console.log(response[0].headers);
    })
    .catch((error) => {
      console.error(error);
    });
  console.log('MAIL SENT');
});

// Verifies email address
router.get('/verify',
  async (req, res) => {
    const errURL = 'https://www.yahoo.com/';
    const successURL = 'https://www.google.ca/';

    if (req.query.email === undefined || req.query.code === undefined) { // Missing info
      console.log('MISSING STUFF');
      res.redirect(301, errURL);
      return;
    }
    if (md5(req.query.email) !== req.query.code) { // Code does not match
      console.log('CODE DOES NOT MATCH');
      res.redirect(301, errURL);
      return;
    }

    await User.findOneAndUpdate({ username: `${req.query.email}` }, { verified: true }).then((data) => {
      if (data === null) {
        console.log('USER WAS UNABLE TO BE VERIFIED');
        res.redirect(301, errURL);
      } else {
        console.log('USER HAS BEEN VERIFIED!');
        res.redirect(301, successURL);
      }
    }).catch((error) => {
      console.log('USER WAS UNABLE TO BE VERIFIED' + error);
      res.redirect(301, errURL);
    });
  });

/* Sample JSON POST /users/login request:
{
    "username": "polisuk@hotmail.com",
    "password": "hello"
}
Returns the JWT token
*/

// By default, if authentication fails, Passport will respond with a 401 Unauthorized status, and any additional route handlers will not be invoked.
router.post('/login', passport.authenticate('local'),
  (req, res) => {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    var token = authenticate.getToken({
      _id: req.user._id
    });
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({
      success: true,
      token: token,
      _id: req.user._id,
      status: 'You are successfully logged in!'
    });
  });

/* Sample JSON PUT /users/:userid/change-password
{
    "old_password": "hello",
    "new_password": "hellohello"
}
*/
router.put('/:userid/change-password', authenticate.verifyOrdinaryUser, (req, res, next) => {
  User.findById(req.params.userid)
    .then(foundUser => {
      foundUser.changePassword(req.body.old_password, req.body.new_password)
        .then((resp) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({
            success: true,
            message: 'Password was successfully updated.'
          });
        })
        .catch((error) => {
          res.statusCode = 404;
          res.setHeader('Content-Type', 'application/json');
          res.json({
            success: false,
            message: 'Password or username is incorrect'
          }); // Return error
          console.log(error);
        });
    })
    .catch(() => {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'application/json');
      res.json({
        success: false,
        message: 'Argument passed in must be a single String of 12 bytes or a string of 24 hex characters'
      }); // Return error
    });
});

module.exports = router;
