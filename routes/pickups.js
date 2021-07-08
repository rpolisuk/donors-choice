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
  .post((req, res, next) => {
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
  .put((req, res, next) => {
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

/* GET donations */
/* Example: /pickups/requests/ */
router.route('/requests')
  .get(authenticate.verifyOrdinaryUser, authenticate.verifyAdmin, async (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    try {
      const results = await Pickup.find({ status: 'scheduled' }).exec();
      if (results.length > 0) {
        res.statusCode = 200;
        res.json({ results });
      } else {
        res.statusCode = 422;
        res.json({
          success: false,
          status: 'No pickups found.'
        });
      }
    } catch (err) {
      console.error(err.message);
    }
  });

module.exports = router;
