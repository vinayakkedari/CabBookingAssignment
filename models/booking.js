const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bookingSchema = new Schema({
  userId: {
    type: String,
    required: true
  },
  cabId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
  },
  pickupLocation: {
    type: Object,
    required: true
  },
  dropLocation: {
    type: Object,
    required: true
  }
}, { timestamps: {} });

module.exports = mongoose.model('bookings', bookingSchema);