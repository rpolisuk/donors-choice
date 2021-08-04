const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const validator = require('validator');
const sgMail = require('@sendgrid/mail');
const config = require('../config');
const md5 = require('md5');
const crypto = require('crypto');
const async = require('async');
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
    html: `<p>Click the following link to verify: <a href="http://${req.headers.host}/users/verify?email=${req.body.username}&code=${md5UserID}"> http://${req.headers.host}/users/verify?email=${req.body.username}&code=${md5UserID} </a></p>`
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
    const errURL = 'https://mighty-wildwood-32432.herokuapp.com/home';
    const successURL = 'https://mighty-wildwood-32432.herokuapp.com/home';

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

    User.findById(req.user._id)
      .then(foundUser => {
        // console.log(foundUser);

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({
          success: true,
          token: token,
          _id: req.user._id,
          verified: foundUser.verified,
          admin: foundUser.admin,
          status: 'You are successfully logged in!'
        });
      });
  });

/* Sample JSON POST /users/forgot request:
{
    "username": "polisuk@hotmail.com",
}
Sends an email to the link to reset password
*/
router.post('/forgot', function (req, res, next) {
  async.waterfall([
    function (done) {
      crypto.randomBytes(20, function (err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function (token, done) {
      User.findOne({ username: req.body.username }, function (_, user) {
        if (!user) {
          res.statusCode = 422;
          res.setHeader('Content-Type', 'application/json');
          res.json({
            success: false,
            status: 'No account with that username exists.'
          });
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function (err) {
          done(err, token, user);
        });
      });
    },
    function (token, user, done) {
      // Send email
      sgMail.setApiKey(config.SENDGRID_API_KEY);
      const msg = {
        to: `${req.body.username}`,
        from: 'rpolisuk@myseneca.ca', // Use the email address or domain you verified above
        subject: 'Donors Choice Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://' + req.headers.host + '/reset/' + token + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
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

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({
        success: true,
        status: 'Request to reset password was succesfully processed.'
      });
    }
  ], function (err) {
    if (err) return next(err);
    res.redirect('/forgot');
  });
});

/* GET token */
/* Example: /users/get?username=polisuk@gmail.com */
router.route('/get')
  .get(async (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    try {
      // execute query with page and limit values
      console.log(req.query.username);
      if (req.query.username !== undefined) {
        const q = await User.findOne({ username: req.query.username }).exec();
        if (q !== null) {
          res.statusCode = 200;
          res.json({
            success: true,
            resetPasswordToken: q.resetPasswordToken,
            resetPasswordExpires: q.resetPasswordExpires
          });
        } else {
          res.statusCode = 422;
          res.json({
            success: false,
            resetPasswordToken: null,
            resetPasswordExpires: null
          });
        }
      } else {
        res.statusCode = 422;
        res.json({
          success: false,
          status: 'Invalid format.'
        });
      }
    } catch (err) {
      console.error(err.message);
    }
  });

/* Sample JSON POST /users/reset/:token request:
{
    "password": "password
}
Resets the password
*/
router.put('/reset/:token', function (req, res) {
  async.waterfall([
    function (done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (_, user) {
        if (user === null) {
          res.statusCode = 422;
          res.setHeader('Content-Type', 'application/json');
          res.json({
            success: false,
            status: 'Password reset token is invalid or has expired.'
          });
        } else {
          user.resetPasswordToken = null;
          user.resetPasswordExpires = null;

          user.setPassword(req.body.password, function () {
            user.save();
          });

          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({
            success: true,
            status: 'Request to reset password was succesfully processed.'
          });
        }
      });
    },
    function (user, done) {
      /*
      var smtpTransport = nodemailer.createTransport('SMTP', {
        service: 'SendGrid',
        auth: {
          user: '!!! YOUR SENDGRID USERNAME !!!',
          pass: '!!! YOUR SENDGRID PASSWORD !!!'
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'passwordreset@demo.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function (err) {
        req.flash('success', 'Success! Your password has been changed.');
        done(err);
      });
      */
    }
  ], function (_) {
    res.redirect('/');
  });
});

/* Sample JSON PUT /users/:userid/change-password
{
    "old_password": "hello",
    "new_password": "hellohello"
}
*/
router.put('/:username/change-password', authenticate.verifyOrdinaryUser, (req, res, next) => {
  User.findOne({ username: req.params.username })
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
