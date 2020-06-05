const shortid = require('shortid');
const config = require('../infrastructure/config');
const DynamoContext = require('../infrastructure/dynamo.context');
const { DefaultException } = require('../exceptions');
const errorCodes = require('../enums/error-codes.enum');

const dynamoContext = new DynamoContext(`99wikis-db-article-${config.env === 'local' ? 'dev' : config.env}`); // necessary replace considering that we don't have local dynamo

/**
 * Create article
 * @param {string} article.topic Article topic
 * @param {string} article.title Article title
 * @param {string} article.body Article body
 * @param {boolean} article.public Article public
 * @param {string} article.createdBy Article createdBy
 * @param {string} article.createdByName Article createdByName
 */
const create = async(article = {}) => {
  article.id = shortid.generate();
  article.createdAt = new Date().toISOString();

  validateRequiredFields(article);

  await dynamoContext.put({ ...article });

  return article;
}

/**
 * Get articles
 * @param {object} params Search params
 */
const get = async(params = {}) => {
  return await dynamoContext.scan(params);
}

/**
 * Get article by text on title or body
 * @param {string} query
 */
const search = async(query) => {
  let filters = {};

  if (query) {
    filters = {
      FilterExpression: "contains(title, :titleQuery) or contains(body, :bodyQuery)",
      ExpressionAttributeValues: {
        ':titleQuery': query,
        ':bodyQuery': query,
      }
    }
  }

  let articles = await dynamoContext.scan({
    ProjectionExpression: 'id, topic, title, createdByName, createdAt',
    ...filters,
  });

  return articles;
}

/**
 * Get article by id
 * @param {string} id
 */
const getById = async(id) => {
  if (!id) throw new Error(`"id" is required`);

  let article = await dynamoContext.scan({
    FilterExpression: 'id = :id',
    ExpressionAttributeValues: { ':id': id }
  });

  article = article && article[0] ? article[0] : null;
  return article
}

/**
 * Update article
 * @param {string} article.id Article id
 * @param {string} article.topic Article topic
 * @param {string} article.title Article title
 * @param {string} article.body Article body
 * @param {boolean} article.public Article public
 * @param {string} article.lastModifiedBy Article lastModifiedBy
 * @param {string} article.lastModifiedByName Article lastModifiedByName
 */
const update = async(articleParam = {}) => {
  const existingArticle = await getById(articleParam.id);

  if (!existingArticle) throw new DefaultException(errorCodes.NOT_FOUND, `Article not found`, 404);

  const article = { ...existingArticle, ...articleParam };
  article.updatedAt = new Date().toISOString();
  article.lastModifiedBy = articleParam.lastModifiedBy;
  article.lastModifiedByName = articleParam.lastModifiedByName;

  validateRequiredFields(article, true);

  await dynamoContext.put(article);

  return article;
}

/**
 * Delete article
 * @param {string} id Article id
 */
const remove = async(id) => {
  const params = { id };

  return dynamoContext.delete(params);
}

const validateRequiredFields = (article, full) => {
  if (!article.id) throw new DefaultException(errorCodes.ARTICLES.INVALID_PAYLOAD, '"id" is required', 400);
  if (!article.topic) throw new DefaultException(errorCodes.ARTICLES.INVALID_PAYLOAD, '"topic" is required', 400);
  if (!article.title) throw new DefaultException(errorCodes.ARTICLES.INVALID_PAYLOAD, '"title" is required', 400);
  if (!article.body) throw new DefaultException(errorCodes.ARTICLES.INVALID_PAYLOAD, '"body" is required', 400);
  if (article.public === undefined) throw new DefaultException(errorCodes.ARTICLES.INVALID_PAYLOAD, '"public" is required', 400);
  if (!article.createdBy) throw new DefaultException(errorCodes.ARTICLES.INVALID_PAYLOAD, '"createdBy" is required', 400);
  if (!article.createdByName) throw new DefaultException(errorCodes.ARTICLES.INVALID_PAYLOAD, '"createdByName" is required', 400);
  if (!article.createdAt) throw new DefaultException(errorCodes.ARTICLES.INVALID_PAYLOAD, '"createdAt" is required', 400);

  if (full) {
    if (!article.lastModifiedBy) throw new DefaultException(errorCodes.ARTICLES.INVALID_PAYLOAD, '"lastModifiedBy" is required', 400);
    if (!article.lastModifiedByName) throw new DefaultException(errorCodes.ARTICLES.INVALID_PAYLOAD, '"lastModifiedByName" is required', 400);
    if (!article.updatedAt) throw new DefaultException(errorCodes.ARTICLES.INVALID_PAYLOAD, '"updatedAt" is required', 400);
  }
}

module.exports = {
  create,
  get,
  getById,
  search,
  update,
  remove,
}