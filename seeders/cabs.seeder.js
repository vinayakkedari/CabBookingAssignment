const Seeder = require('mongoose-data-seed').Seeder;
const Model = require('../models/cab');
const data = require('../data/cab.json');

class CabsSeeder extends Seeder {

  async shouldRun() {
    return Model.count().exec().then(count => count === 0);
  }

  async run() {
    return Model.create(data);
  }
}

module.exports = CabsSeeder;
