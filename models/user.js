const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose'); // https://www.npmjs.com/package/passport-local-mongoose

const User = new Schema({
  firstname: {
    type: String,
    default: ''
  },
  lastname: {
    type: String,
    default: ''
  },
  verified: {
    type: Boolean,
    default: false
  },
  admin: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);
