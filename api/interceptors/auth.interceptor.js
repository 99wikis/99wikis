const config = require('../infrastructure/config');
const { DefaultException } = require('../exceptions');
const errorCodes = require('../enums/error-codes.enum');
//

const optionalAuthInterceptor = (passport) => {
  return (req, res, next) => {
    if (req.headers.authorization) return passport.authenticate("jwt", { session: false })(req, res, next);
    else req.user = false;

    next();
  };
};

const mandatoryAuthInterceptor = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) throw new DefaultException(errorCodes.UNAUTHORIZED, 'Unauthorized', 401);

    if (allowedRoles && !allowedRoles.some(r => r === req.user.role)) throw new DefaultException(errorCodes.UNAUTHORIZED, 'Unauthorized', 401);

    next();
  };
};

module.exports = { mandatoryAuthInterceptor, optionalAuthInterceptor };
