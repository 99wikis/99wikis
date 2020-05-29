const jwt = require('jsonwebtoken');
const config = require('../infrastructure/config');
const { users: usersModel } = require('../models');
const { comparePassword } = require('../utils');
const { DefaultException } = require('../exceptions');
const { errorCodesEnum: errorCodes, roleEnum: roles} = require('../enums');

const get = async (params) => {
  const users = await usersModel.get(params);

  return users.map(u => convertToPublicFormat(u));
}

const getById = async (id) => {
  const user = await usersModel.getById(id);

  return convertToPublicFormat(user);
}

const update = async (user) => {
  return usersModel.update(user);
}

const register = async (name, email, password) => {
  const userModel = { name, email, password };

  // If this is the first user, make him the admin
  const isUserTableEmpty = await usersModel.isTableEmpty();
  userModel.approved = isUserTableEmpty;
  userModel.role = isUserTableEmpty ? roles.ADMIN : roles.READER;

  await usersModel.create({ ...userModel });

  if (!isUserTableEmpty) return null; 

  const user = await usersModel.getByEmail(email);

  const token = jwt.sign(user, config.tokenSecret, {
    expiresIn: 604800 // 1 week
  });

  return token;
}

const login = async (email, password) => {
  const user = await usersModel.getByEmail(email);

  if (!user) throw new DefaultException(errorCodes.USERS.EMAIL_NOT_FOUND, 'Authentication failed. User not found.', 404);

  const isPasswordCorrect = comparePassword(password, user.password);
  if (!isPasswordCorrect) throw new DefaultException(errorCodes.USERS.WRONG_CREDENTIALS, 'Authentication failed. Wrong password.', 401);

  if (!user.approved) throw new DefaultException(errorCodes.USERS.NOT_APPROVED, 'User not approved, contact admin for approval', 400);

  const token = jwt.sign(user, config.tokenSecret, {
    expiresIn: 604800 // 1 week
  });

  return token;
}

const convertToPublicFormat = (user) => {
  if (!user) return user;

  const convertedUser = usersModel.convertToPublicFormat(user);
  return convertedUser;
}

module.exports = {
  get,
  getById,
  update,
  register,
  login,
  convertToPublicFormat,
}