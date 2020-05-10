const Cab = require('./../models/cab');
const Booking = require('./../models/booking');
const userController = require('./../controller/user');

async function cabBooking(request, response) {

  if (request.body.pickupLocation.hasOwnProperty('lattitude') && request.body.pickupLocation.hasOwnProperty('longitude')
    && !isNaN(request.body.pickupLocation.lattitude) && !isNaN(request.body.pickupLocation.longitude)

    && request.body.dropLocation.hasOwnProperty('lattitude') && request.body.dropLocation.hasOwnProperty('longitude')
    && !isNaN(request.body.dropLocation.lattitude) && !isNaN(request.body.dropLocation.longitude)) {
    const pickup_lattitude = parseInt(request.body.pickupLocation.lattitude);
    const pickup_longitude = parseInt(request.body.pickupLocation.longitude);

    const drop_lattitude = parseInt(request.body.dropLocation.lattitude);
    const drop_longitude = parseInt(request.body.dropLocation.longitude);

    const userLocation = {
      lattitude: pickup_lattitude,
      longitude: pickup_longitude
    };
    const dropLocation = {
      lattitude: drop_lattitude,
      longitude: drop_longitude
    };

    const cab = await getClosestCab(userLocation);

    if (cab) {
      const userId = await userController.getUsernameFromToken(request);
      // Update the cab status as booked true
      Cab.updateOne({
        _id: cab._id
      }, {
          $set: {
            isBooked: true
          }
        }, function (err, cabUpdated) {

          // Save the booking details
          const booking = new Booking({
            userId: userId,
            cabId: cab._id,
            status: "BOOKED",
            pickupLocation: userLocation,
            dropLocation: dropLocation
          });

          booking.save(function (error, bookingSaved) {

            if (error) {
              response.status(500).json({
                success: false,
                message: 'Internal server error'
              });
            } else {
              response.status(201).json({
                message: "Cab booked!",
                bookingId: bookingSaved._id,
                cabID: cab._id,
                userId: userId,
                driverName: cab.driverName,
                cabNumber: cab.cab_number,
                location: cab.location
              });
            }

          })
        });

    } else {
      response.json({
        message: "No cabs available!"
      });
    }

  } else {
    response.status(400).json({
      message: "Invalid/Missing parameters"
    });
  }
}

function complete(request, response) {
  if (request.body.hasOwnProperty('cabId') && request.body.hasOwnProperty('bookingId')) {
    // Update the cab status 
    Cab.updateOne({
      _id: request.body.cabId
    }, {
        $set: {
          isBooked: false
        }
      }, function (err, cabUpdated) {
        Booking.updateOne({
          _id: request.body.bookingId
        }, {
            $set: {
              status: 'COMPLETE'
            }
          }, function (err, bookingUpdated) {
            response.status(200).json({
              message: "Ride Completed!"
            });
          })
      })
  } else {
    response.status(400).json({
      message: "Invalid/Missing parameters"
    });
  }
}

async function pastBookings(request, response) {

  const page = request.query.page || 1;
  let skip = page * 10 - 10;

  const userId = await userController.getUsernameFromToken(request);

  Booking.find({
    userId: userId
  }, function (err, records) {
    if (err) {
      response.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    } else if (records.length < 1) {
      response.status(200).json({
        success: true,
        message: 'No past bookings available.'
      });
    } else {
      response.status(200).json({
        success: true,
        bookings: records
      });
    }
  }).sort({
    createdAt: -1
  }).skip(skip).limit(10);
}

function getDistance(location1, location2) {
  const a = location1.lattitude - location2.lattitude;
  const b = location1.longitude - location2.longitude;
  const c = Math.sqrt(a * a + b * b);
  return c;
}

function getClosestCab(location) {
  return new Promise((resolve, reject) => {
    let closest = null;
    let closestDistance = Infinity;

    Cab.find({ isBooked: false }, function (err, records) {

      records.forEach(function (cab, index) {
        if (!cab.isBooked) {
          let distance = getDistance(cab.location, location);
          if (distance < closestDistance) {
            closestDistance = distance;
            closest = cab;
          }
        }
        if (index === records.length - 1) {
          resolve(closest);
        }
      });
    })
  });
}

module.exports = {
  cabBooking: cabBooking,
  complete: complete,
  pastBookings: pastBookings
};