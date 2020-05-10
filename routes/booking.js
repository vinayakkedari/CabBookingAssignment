const express = require('express');
const router = express.Router();
const booking = require('./../controller/booking');
const verifyUser = require('./../middleware/user');
const validator = require('express-joi-validation').createValidator({})
const validatorSchema = require('./../validator/validator');

/**
 * @swagger
 * tags:
 *   name: Booking
 *   description: All about bookings
 */

/**
 * @swagger
 * /booking:
 *   post:
 *     summary: verify token  middleware
 *     description: Verify user
 *     tags: [Users]
 *     parameters:
 *       - name: x-access-token
 *         description: access token to authorise
 *         in: header
 *         type: string
 *         required: true
 */
router.use('/booking/',
  validator.headers(validatorSchema.headerSchema),
  verifyUser);

/**
 * @swagger
 * /booking/book:
 *   post:
 *     summary: Book nearest cab
 *     description: Book nearest cab
 *     tags: [Booking]
 *     parameters:
 *       - name: x-access-token
 *         description: access token to authorise
 *         in: header
 *         type: string
 *         required: true
 *       - name: pickupLocation
 *         description: pickup location lat long object
 *         in: body
 *         type: object
 *         required: true
 *       - name: dropLocation
 *         description: drop location lat long object
 *         in: body
 *         type: object
 *         required: true
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Success cab Booked.
 */
router.post('/booking/book',
  validator.headers(validatorSchema.headerSchema),
  validator.body(validatorSchema.bookBodySchema),
  booking.cabBooking);

/**
 * @swagger
 * /booking/complete:
 *   post:
 *     summary: Complete cab ride
 *     description: Complete cab ride
 *     tags: [Booking]
 *     parameters:
 *       - name: x-access-token
 *         description: access token to authorise
 *         in: header
 *         type: string
 *         required: true
 *       - name: cabId
 *         description: cab Id from response of book cab
 *         in: body
 *         type: string
 *         required: true
 *       - name: bookingId
 *         description: booking Id from response of book cab
 *         in: body
 *         type: string
 *         required: true
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Success ride completed.
 */
router.post('/booking/complete',
  validator.headers(validatorSchema.headerSchema),
  validator.body(validatorSchema.completeBodySchema),
  booking.complete);

/**
 * @swagger
 * /booking/pastBookings:
 *   get:
 *     summary: get past bookings
 *     description: Get past bookings
 *     tags: [Booking]
 *     parameters:
 *       - name: x-access-token
 *         description: access token to authorise
 *         in: header
 *         type: string
 *         required: true
 *       - name: page
 *         description: page number for pagination
 *         in: query
 *         type: number
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Success list of bookings.
 */
router.get('/booking/pastBookings',
  validator.headers(validatorSchema.headerSchema),
  booking.pastBookings);

module.exports = router;