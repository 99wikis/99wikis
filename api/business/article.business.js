const { articles: articlesModel } = require('../models');
const { DefaultException } = require('../exceptions');
const { errorCodesEnum: errorCodes } = require('../enums');

const create = async (articleParam, sessionUser) => {
  const article = { ...articleParam };

  article.createdBy = sessionUser.id;
  article.createdByName = sessionUser.name;

  return articlesModel.create(article);
}

const get = async (params) => {
  return articlesModel.get(params);
}

const search = async (query) => {
  return articlesModel.search(query);
}

const getById = async (id) => {
  return articlesModel.getById(id);
}

const update = async (articleParam, sessionUser) => {
  const article = { ...articleParam };

  article.lastModifiedBy = sessionUser.id;
  article.lastModifiedByName = sessionUser.name;

  return articlesModel.update(article);
}

const remove = async (id) => {
  return articlesModel.remove(id);
}

const getTopics = async () => {
  const leanArticles = await articlesModel.search();

  return leanArticles.map(a => a.topic);
}

module.exports = {
  create,
  get,
  getById,
  search,
  update,
  remove,
  getTopics,
}