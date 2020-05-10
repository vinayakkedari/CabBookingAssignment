const mongoose = require('mongoose');
const users = require('./seeders/users.seeder');
const cab = require('./seeders/cabs.seeder');
const config = require('./config');

/**
 * Seeders List
 * order is important
 * @type {Object}
 */
module.exports.seedersList = {
  users,
  cab
};
/**
 * Connect to mongodb implementation
 * @return {Promise}
 */
module.exports.connect = async () =>
  await mongoose.connect(config.connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
/**
 * Drop/Clear the database implementation
 * @return {Promise}
 */
module.exports.dropdb = async () => mongoose.connection.db.dropDatabase();
