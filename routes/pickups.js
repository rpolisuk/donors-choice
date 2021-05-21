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
            "businessnumber": "12345",
            "percent": "10"
        },
        {
            "businessnumber": "789098",
            "percent": "90"
        }
    ],
    "pickupdate": "2021-06-01",
    "pickuptime": "Morning"
}
*/
router.route('/')
  .post((req, res, next) => {
    Pickup.create(req.body)
      .then((pickup) => {
        console.log('Promotion created ', pickup);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(pickup);
      }, (err) => next(err))
      .catch((err) => next(err));
  })

/*
{
    "status": "cancelled"
}
*/
router.route('/:pickupId')
.put((req, res, next) => {
  Pickup.findByIdAndUpdate(req.params.pickupId, {
      $set: req.body
    }, {
      new: true
    })
    .then((pickup) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(pickup);
    }, (err) => next(err))
    .catch((err) => next(err));
})

module.exports = router;