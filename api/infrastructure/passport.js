const StrategyJWT = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const { users } = require('../models');
const config = require('./config');

module.exports = (passport) => {

  const options = {}
  options.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken()
  options.secretOrKey = config.tokenSecret;

  passport.use(new StrategyJWT(options, async (jwtPayload, done) => {
    try {
      const user = await users.getById(jwtPayload.id);

      if (!user) return done(null, false);

      return done(null, user);
    } catch(e) {
      throw e;
    }
  }))
}