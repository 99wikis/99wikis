const shortid = require('shortid');
const config = require('../infrastructure/config');
const DynamoContext = require('../infrastructure/dynamo.context');
const { DefaultException } = require('../exceptions');
const errorCodes = require('../enums/error-codes.enum');
const utils = require('../utils');

const dynamoContext = new DynamoContext(`99wikis-db-user-${config.env === 'local' ? 'dev' : config.env}`); // necessary replace considering that we don't have local dynamo

/**
 * Create user
 * @param {string} user.email User email
 * @param {string} user.password User password
 */
const create = async(user = {}) => {
  if (!user.name) throw new DefaultException(errorCodes.USERS.INCOMPLETE_LOGIN_INFO, '"name" is required', 400);

  if (!user.email) throw new DefaultException(errorCodes.USERS.INCOMPLETE_LOGIN_INFO, '"email" is required', 400);

  if (!user.password) throw new DefaultException(errorCodes.USERS.INCOMPLETE_LOGIN_INFO, '"password" is required', 400);

  if (!utils.validateEmailAddress(user.email)) {
    throw new DefaultException(errorCodes.USERS.INVALID_EMAIL, `"${user.email}" is not a valid email address`, 400);
  }

  const existingUser = await getByEmail(user.email)

  if (existingUser) throw new DefaultException(errorCodes.USERS.EMAIL_IN_USE, `A user with email "${user.email}" is already registered`, 409);

  user.id = shortid.generate();
  user.password = utils.hashPassword(user.password);
  user.approved = user.approved !== undefined ? user.approved : false;
  user.role = user.role || 'reader';

  await dynamoContext.put(user)

  return user;
}

/**
 * Get users
 * @param {object} params Search params
 */
const get = async(params = {}) => {
  return await dynamoContext.scan(params);
}

/**
 * Update user
 * @param {string} user.id User id
 * @param {string} user.approved User approval state
 * @param {string} user.role User role
 */
const update = async(userParam = {}) => {
  const existingUser = await getById(userParam.id);

  if (!existingUser) throw new DefaultException(errorCodes.NOT_FOUND, `User not found`, 404);

  const user = { ...existingUser };
  user.approved = userParam.approved;
  user.role = userParam.role;

  await dynamoContext.put(user);

  return user;
}

/**
 * Get user by email address
 * @param {string} email
 */
const getByEmail = async(email) => {
  if (!utils.validateEmailAddress(email)) {
    throw new DefaultException(errorCodes.USERS.INVALID_EMAIL, `"${email}" is not a valid email address`, 400);
  }

  let user = await dynamoContext.scan({
    FilterExpression: "email = :email",
    ExpressionAttributeValues: { ":email": email }
  });

  user = user && user[0] ? user[0] : null;

  return user;
}

/**
 * Get user by id
 * @param {string} id
 */
const getById = async(id) => {
  if (!id) throw new Error(`"id" is required`);

  let user = await dynamoContext.scan({
    FilterExpression: 'id = :id',
    ExpressionAttributeValues: { ':id': id }
  });

  user = user && user[0] ? user[0] : null;
  return user
}

/**
 * Convert user record to public format
 * @param {*} user 
 */
const convertToPublicFormat = (user = {}) => {
  if (user.password) delete user.password;

  return user
}

/**
 * Returns wheter or not a table is empty
 * @param {*} params
 */
const isTableEmpty = async () => {
  return dynamoContext.isTableEmpty();
}

module.exports = {
  create,
  get,
  update,
  getByEmail,
  getById,
  convertToPublicFormat,
  isTableEmpty,
}