const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const status = dotenv.config({ silent: true });
const app = express();
const execSync = require('child_process').execSync;
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true }, function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log('Connected');
    const output = execSync('md-seed run', { encoding: 'utf-8' });
    console.log(output);
  }
});

// swagger definition
const swaggerDefinition = {
  info: {
    title: 'Cab booking',
    version: '1.0.0',
    description: 'Cab booking APIs assignment',
  },
  host: 'localhost:3000',
  basePath: '/',
};

// options for the swagger docs
var options = {
  // import swaggerDefinitions
  swaggerDefinition: swaggerDefinition,
  // path to the API docs
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

// serve swagger
app.get('/swagger.json', function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.use('/', require('./routes/user'));
app.use('/', require('./routes/booking'));

const server = app.listen(process.env.PORT, function () {
  console.log('Server listening at ', process.env.PORT);
});