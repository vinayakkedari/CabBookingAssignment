const Seeder = require('mongoose-data-seed').Seeder;
const Model = require('../models/user');
const data = require('../data/user.json');

class UsersSeeder extends Seeder {

  async shouldRun() {
    return Model.count().exec().then(count => count === 0);
  }

  async run() {
    return Model.create(data);
  }
}

module.exports = UsersSeeder;
