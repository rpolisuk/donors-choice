var express = require('express');
var router = express.Router();
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
  .post((req, res, next) => {
    Donation.create(req.body)
      .then((donation) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({
          success: true,
          message: 'Successfully scheduled.'
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
