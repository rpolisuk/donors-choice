var express = require('express');
var router = express.Router();
var Pickup = require('../models/pickup');
var authenticate = require('../authenticate');

/*
{
    "username": "polisuk@hotmail.com",
    "contactname": "Richard Polisuk",
    "address": "91 Combe Avenue",
    "city": "Toronto",
    "province": "Ontario",
    "postalcode": "M3H4J6",
    "phone": "416-398-0453",
    "items": [
        "MenClothes",
        "WomenClothes"
    ],
    "donations": [
        {
            "businessnumber": "821832037RR0001",
            "percent": "50"
        },
        {
            "businessnumber": "135518140RR0001",
            "percent": "50"
        }
    ],
    "pickupdate": "2021-06-01",
    "pickuptime": "Morning"
}
*/
router.route('/schedule')
  .post(authenticate.verifyOrdinaryUser, (req, res, next) => {
    Pickup.create(req.body)
      .then((pickup) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({
          success: true,
          message: 'Successfully scheduled.'
        });
      }, (err) => next(err))
      .catch((err) => next(err));
  });

/*
{
    "status": "cancelled"
}
*/
router.route('/update/:pickupId')
  .put(authenticate.verifyOrdinaryUser, (req, res, next) => {
    Pickup.findByIdAndUpdate(req.params.pickupId, {
      $set: req.body
    }, {
      new: true
    })
      .then((pickup) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({
          success: true,
          message: 'Updated successfully.'
        });
      }, (err) => next(err))
      .catch((err) => next(err));
  });

module.exports = router;
