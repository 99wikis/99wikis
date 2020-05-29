const express = require('express');
const Validator = require('../infrastructure/validator');
const { errorCodesEnum: errorCodes, roleEnum: roles } = require('../enums');
const userSchema = require('../validations/user.validation');
const responseFactory = require('../factories/response.factory');
const userBusiness = require('../business/user.business');
const { mandatoryAuthInterceptor } = require('../interceptors/auth.interceptor');

const router = express.Router();

router.route('/')
  /**
   * List all Users
   * @group Users - Operations to manipulate Users
   * @operationId userGetAll
   * @route GET /users
   * @produces application/json
   * @returns {Array.<User>} 200 - Users
   * @returns {Response.model}  default - Unexpected error
   * @security JWT
   */
  .all(mandatoryAuthInterceptor([roles.ADMIN]))
  .get(async (req, res, next) => {
    try {
      const users = await userBusiness.get({});

      res.json(responseFactory.success(users));
    } catch (e) {
      next(e);
    }
  });

router.route('/:id')
  /**
   * Get user by Id
   * @group Users - Operations to manipulate Users
   * @operationId userGetById
   * @route GET /users/{id}
   * @produces application/json
   * @param {string} id.path.required - The user ID
   * @returns {User.model} 200 - User
   * @returns {Response.model}  default - Unexpected error
   * @security JWT
   */
  .get(mandatoryAuthInterceptor(), async (req, res, next) => {
    try {
      const user = await userBusiness.getById(req.params.id);

      res.json(responseFactory.success(user));
    } catch (e) {
      next(e);
    }
  })
  /**
   * Update user by Id
   * @group Users - Operations to manipulate Users
   * @operationId userPatchById
   * @route PATCH /users/{id}
   * @produces application/json
   * @param {string} id.path.required - The user ID
   * @param {User.model} user.body.required - User payload
   * @returns {User.model} 200 - User
   * @returns {Response.model}  default - Unexpected error
   * @security JWT
   */
  .patch(mandatoryAuthInterceptor([roles.ADMIN]), async (req, res, next) => {
    try {
      const userParam = Validator.validate(req.body, userSchema.userUpdate, errorCodes.USERS.INVALID_PAYLOAD);
      userParam.id = req.params.id;

      await userBusiness.update(userParam);

      res.json(responseFactory.success());
    } catch (e) {
      next(e);
    }
  });

module.exports = router;