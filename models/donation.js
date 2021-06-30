const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Donation = new Schema({
  pickupid: {
    type: String,
    required: true
  },
  donorid: {
    type: String,
    required: true
  },
  adminid: {
    type: String,
    required: true
  },
  businessnumber: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    min: 0,
    max: 999999,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Donation', Donation);
