const express = require('express');
const Validator = require('../infrastructure/validator');
const errorCodes = require('../enums/error-codes.enum');
const userSchema = require('../validations/user.validation');
const responseFactory = require('../factories/response.factory');
const userBusiness = require('../business/user.business');

const router = express.Router();

router.route('/')
  /**
   * Get current session User
   * @group Auth - Operations related to Auth
   * @operationId userGetFromSession
   * @route GET /auth
   * @produces application/json
   * @returns {User.model} 200 - User
   * @returns {Response.model}  default - Unexpected error
   * @security JWT
   */
  .get(async (req, res, next) => {
    try {
      const user = userBusiness.convertToPublicFormat(req.user);

      res.json(responseFactory.success(user));
    } catch (e) {
      next(e);
    }
  });

/**
 * Perform login operation
 * @group Auth - Operations related to Auth
 * @operationId userLogin
 * @route POST /auth/login
 * @consumes application/json
 * @param {Login.model} register.body.required - the new point
 * @produces application/json
 * @returns {string} 200 - Token
 * @returns {Response.model}  default - Unexpected error
 */
router.route('/login')
  .post(async (req, res, next) => {
    try {
      const { email, password } = Validator.validate(req.body, userSchema.login, errorCodes.USERS.INCOMPLETE_LOGIN_INFO);

      const token = await userBusiness.login(email, password);

      res.json(responseFactory.success(token));
    } catch (e) {
      next(e);
    }
  });

/**
 * Perform register operation
 * @group Auth - Operations related to Auth
 * @operationId userRegister
 * @route POST /auth/register
 * @consumes application/json
 * @param {Register.model} register.body.required - the new point
 * @produces application/json
 * @returns {string} 200 - Token
 * @returns {Response.model}  default - Unexpected error
 */
router.route('/register')
  .post(async (req, res, next) => {
    try {
      const { 
        name,
        email,
        password
      } = Validator.validate(req.body, userSchema.register, errorCodes.USERS.INCOMPLETE_REGISTER_INFO);

      const token = await userBusiness.register(name, email, password);

      res.json(responseFactory.success(token));
    } catch (e) {
      next(e);
    }
  });

module.exports = router;
