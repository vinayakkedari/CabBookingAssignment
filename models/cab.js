const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const cabSchema = new Schema({
  driverName: {
    type: String,
    required: true
  },
  mobile_num: {
    type: Number,
    required: true,
    unique: true,
  },
  cab_number: {
    type: String,
    required: true
  },
  isBooked: {
    type: Boolean,
    default: false,
    required: true
  },
  location: {
    type: Object,
    required: true
  }
}, { timestamps: {} });

module.exports = mongoose.model('cabs', cabSchema);