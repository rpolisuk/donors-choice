const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const donationSchema = new Schema({
  businessnumber: {
    type: String,
    default: ''
  },
  percent: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  }
});

const Pickup = new Schema({
  username: {
    type: String,
    required: true
  },
  contactname: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  province: {
    type: String,
    required: true
  },
  postalcode: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  items: [String],
  donations: [donationSchema],
  pickupdate: {
    type: String,
    required: true
  },
  pickuptime: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    default: 'scheduled'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Pickup', Pickup);
