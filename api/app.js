const express = require('express');
var cors = require('cors');
const bodyparser = require('body-parser');
const config = require('./infrastructure/config');
const routes = require('./routes');
const errorInterceptor = require('./interceptors/error.interceptor');
const { optionalAuthInterceptor } = require('./interceptors/auth.interceptor');
const swaggerSetup = require('./infrastructure/swagger-setup');

const app = express();
const passport = require('passport');

// Configure Passport
require('./infrastructure/passport')(passport);

/**
 * Configure Express.js Middleware
 */

app.use(cors());

// Initialize Passport and restore authentication state, if any, from the session
app.use(passport.initialize());
app.use(passport.session());
app.use(optionalAuthInterceptor(passport));

app.use(express.json());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.disable('etag');

// Setting up api documentation
swaggerSetup(app);

/**
 * Routes
 */

app.options(`*`, (req, res) => {
  res.status(200).send()
});

// API definition
app.use(routes);

// Error handling
app.use(errorInterceptor);

// Starting server if we're in local-development mode
if (config.env === 'local') {
  app.listen(config.port, () => {
    console.log(`Server started in development mode at port :${config.port}`);
  });
}

module.exports = app
