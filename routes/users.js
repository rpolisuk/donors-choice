var express = require('express');
var router = express.Router();
var User = require('../models/user');
var passport = require('passport');
var authenticate = require('../authenticate');

/* GET users listing. */
router.route('/')
  .get(authenticate.verifyOrdinaryUser, authenticate.verifyAdmin, (req, res, next) => {
    User.find({})
      .then((users) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(users);
      }, (err) => next(err))
      .catch((err) => next(err));
  });

/* Sample JSON POST /users/signup request:
{
    "firstname": "richard",
    "lastname": "polisuk",
    "username": "polisuk@hotmail.com",
    "password": "hello"
}
*/
router.post('/signup', (req, res, next) => {
  User.register(new User({
    username: req.body.username
  }),
  req.body.password, (err, user) => {
    if (err) {
      res.statusCode = 422;
      res.setHeader('Content-Type', 'application/json');
      res.json({
        err: err
      });
    } else {
      if (req.body.firstname) { user.firstname = req.body.firstname; }
      if (req.body.lastname) { user.lastname = req.body.lastname; }
      user.save((err, user) => {
        if (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({
            err: err
          });
          return;
        }
        passport.authenticate('local')(req, res, () => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({
            success: true,
            status: 'Registration Successful!'
          });
        });
      });
    }
  });
});

/* Sample JSON POST /users/login request:
{
    "username": "polisuk@hotmail.com",
    "password": "hello"
}
Returns the JWT token
*/
router.post('/login', passport.authenticate('local'), (req, res) => {
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
