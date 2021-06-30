var express = require('express');
var router = express.Router();
var Charity = require('../models/charity');

/* GET charity listing. */
router.route('/')
  .get(async (req, res, next) => {
    const {
      legalname = '', page = 1, limit = 10
    } = req.query;

    try {
      // execute query with page and limit values
      console.log(req.query);
      const charities = await Charity.find({
        legalname: new RegExp(legalname, 'i')
      })
        .sort({
          legalname: 1
        })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();

      // get total documents in the collection
      const count = await Charity.find({
        legalname: new RegExp(legalname, 'i')
      }).countDocuments();
      // console.log('count=' + count);

      // return response with results, total pages, and current page
      res.json({
        charities,
        totalPages: Math.ceil(count / limit),
        currentPage: page
      });
    } catch (err) {
      console.error(err.message);
    }
  });

module.exports = router;
