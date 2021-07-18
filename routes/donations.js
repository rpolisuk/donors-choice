var express = require('express');
var router = express.Router();
const sgMail = require('@sendgrid/mail');
const config = require('../config');
var Donation = require('../models/donation');
var authenticate = require('../authenticate');

/*
{
    "pickupid": "60d1f274f8bef37d84298e23",
    "donorid": "polisuk@gmail.com",
    "adminid": "polisuk@gmail.com",
    "businessnumber": "821832037RR0001",
    "amount": 50
}
*/
router.route('/create')
  .post(async (req, res, next) => {
    Donation.create(req.body)
      .then((donation) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        //
        // Send email
        sgMail.setApiKey(config.SENDGRID_API_KEY);
        const msg = {
          to: `${req.body.donorid}`,
          from: 'rpolisuk@myseneca.ca', // Use the email address or domain you verified above
          subject: 'Donation Confirmation',
          html: `<p>A donation has been successfully made in your name to ${req.body.businessnumber} for the amount of $${req.body.amount}.<br>
                No tax receipt is issued for this donation, however we greatly appreciate your donation. Thank you for using Donor's Choice.</p>`
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

/* GET donations */
/* Example: /donations/history/get?donorid=polisuk@gmail.com */
router.route('/history')
  .get(async (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    try {
      if (req.query.donorid !== undefined) {
        const results = await Donation.find({ donorid: req.query.donorid }).exec();
        if (results.length > 0) {
          res.statusCode = 200;
          res.json({ results });
        } else {
          res.statusCode = 422;
          res.json({
            success: false,
            status: 'No donations found.'
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

module.exports = router;
