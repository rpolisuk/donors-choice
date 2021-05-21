const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Charity = new Schema({
  businessnumber: {
    type: String,
    default: ''
  },
  legalname: {
    type: String,
    default: ''
  },
  addressline1: {
    type: String,
    default: ''
  },
  addressline2: {
    type: String,
    default: ''
  },
  city: {
    type: String,
    default: ''
  },
  province: {
    type: String,
    default: ''
  },
  postalcode: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: ''
  }
});

module.exports = mongoose.model('Charity', Charity);
