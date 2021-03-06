const errorCodes = {
  'UNEXPECTED': 100,
  'VALIDATION_ERROR': 101,
  'NOT_FOUND': 103,
  'UNAUTHORIZED': 104,
  'USERS': {
    'INCOMPLETE_LOGIN_INFO': 1001,
    'INCOMPLETE_REGISTER_INFO': 1002,
    'EMAIL_NOT_FOUND': 1003,
    'WRONG_CREDENTIALS': 1004,
    'EMAIL_IN_USE': 1005,
    'INVALID_EMAIL': 1006,
    'NOT_APPROVED': 1007,
    'INVALID_PAYLOAD': 1008,
  },
  'ARTICLES': {
    'INVALID_PAYLOAD': 2001,
  },
};

module.exports = { ...errorCodes };
