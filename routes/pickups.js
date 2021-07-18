var express = require('express');
var router = express.Router();
const sgMail = require('@sendgrid/mail');
const config = require('../config');
var Pickup = require('../models/pickup');
const User = require('../models/user');
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
        //
        // Send email
        sgMail.setApiKey(config.SENDGRID_API_KEY);
        const msg = {
          to: `${pickup.username}`,
          from: 'rpolisuk@myseneca.ca', // Use the email address or domain you verified above
          subject: 'Pickup Confirmation',
          html: `<p>Your pickup is scheduled for ${pickup.pickupdate} for ${pickup.pickuptime}.<br>
                Here is your confirmation information:<br>
                Confirmation #: ${pickup._id}<br>
                Contact Name: ${pickup.contactname}<br>
                Address: ${pickup.address}<br>
                City: ${pickup.city}<br>
                Province: ${pickup.province}<br>
                Postal Code: ${pickup.postalcode}<br>
                Phone: ${pickup.phone}<br>
                Items: ${pickup.items}<br>
                Charity: ${pickup.donations[0].businessnumber}`
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
          message: 'Successfully scheduled.',
          pickup
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
      .then(async (pickup) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        if (req.body.status === 'cancelled') {
          const user = await User.findOne({ businessnumber: req.query.businessnumber }).exec();
          //
          // Send email
          sgMail.setApiKey(config.SENDGRID_API_KEY);
          const msg = {
            to: `${user.username}`,
            from: 'rpolisuk@myseneca.ca', // Use the email address or domain you verified above
            subject: 'Pickup cancellation',
            html: `<p>Your pickup ${req.params.pickupId} has been cancelled.</p>`
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
        }
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
