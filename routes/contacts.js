var express = require('express');
var router = express.Router();
const sgMail = require('@sendgrid/mail');
const config = require('../config');
var Contact = require('../models/contact');
var authenticate = require('../authenticate');

/* /contacts/create
{
    "fname": "Richard",
    "lname": "Polisuk",
    "subject": "Test Message",
    "email": "polisuk@gmail.com",
    "message": "This is a test message. This is a second sentence."
}
*/
router.route('/create')
  .post(async (req, res, next) => {
    Contact.create(req.body)
      .then((contact) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');

        //
        // Send email
        sgMail.setApiKey(config.SENDGRID_API_KEY);
        const msg = {
          to: 'polisuk@gmail.com',
          from: 'rpolisuk@myseneca.ca', // Use the email address or domain you verified above
          subject: `${req.body.subject}`,
          html: `<p>The following message is from: ${req.body.fname} ${req.body.lname} (${req.body.email})<br>${req.body.message}</p>`
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
        //
        res.json({
          success: true,
          message: 'Successfully added.'
        });
      }, (err) => next(err))
      .catch((err) => next(err));
  });

module.exports = router;
