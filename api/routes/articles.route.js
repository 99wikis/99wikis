const express = require('express');
const Validator = require('../infrastructure/validator');
const { errorCodesEnum: errorCodes, roleEnum: roles } = require('../enums');
const articleSchema = require('../validations/article.validation');
const responseFactory = require('../factories/response.factory');
const articleBusiness = require('../business/article.business');
const { mandatoryAuthInterceptor } = require('../interceptors/auth.interceptor');

const router = express.Router();

router.all(mandatoryAuthInterceptor());

router.route('/')
  /**
   * List all Articles
   * @group Articles - Operations to manipulate Articles
   * @operationId articleGetAll
   * @route GET /articles
   * @produces application/json
   * @returns {Array.<Article>} 200 - Articles
   * @returns {Response.model}  default - Unexpected error
   * @security JWT
   */
  .get(async (req, res, next) => {
    try {
      const articles = await articleBusiness.get({});

      res.json(responseFactory.success(articles));
    } catch (e) {
      next(e);
    }
  })
  /**
   * Create article
   * @group Articles - Operations to manipulate Articles
   * @operationId articleCreate
   * @route POST /articles
   * @produces application/json
   * @param {ArticleMutation.model} article.body.required - Article payload
   * @returns {Article.model} 200 - Article
   * @returns {Response.model}  default - Unexpected error
   * @security JWT
   */
  .post(mandatoryAuthInterceptor([roles.ADMIN, roles.CONTRIBUTOR]), async (req, res, next) => {
    try {
      const articleParam = Validator.validate(req.body, articleSchema.articleResource.body, errorCodes.ARTICLES.INVALID_PAYLOAD);

      const article = await articleBusiness.create(articleParam, req.user);

      res.json(responseFactory.success(article));
    } catch (e) {
      next(e);
    }
  });

  router.route('/topics')
  /**
   * List all Topics
   * @group Articles - Operations to manipulate Articles
   * @operationId articleTopicsGetAll
   * @route GET /articles/topics
   * @produces application/json
   * @returns {Array.<string>} 200 - Article topics
   * @returns {Response.model}  default - Unexpected error
   * @security JWT
   */
  .get(async (req, res, next) => {
    try {
      const topics = await articleBusiness.getTopics();

      res.json(responseFactory.success(topics));
    } catch (e) {
      next(e);
    }
  });

router.route('/search')
  /**
   * Search string on articles body and title
   * @group Articles - Operations to manipulate Articles
   * @operationId articleSearch
   * @route GET /articles/search
   * @produces application/json
   * @param {string} query.query.required - The search query
   * @returns {Array.<Article>} 200 - Articles
   * @returns {Response.model}  default - Unexpected error
   * @security JWT
   */
  .get(async (req, res, next) => {
    try {
      const articles = await articleBusiness.search(req.query.query);

      res.json(responseFactory.success(articles));
    } catch (e) {
      next(e);
    }
  });

router.route('/:id')
  /**
   * Get article by Id
   * @group Articles - Operations to manipulate Articles
   * @operationId articleGetById
   * @route GET /articles/{id}
   * @produces application/json
   * @param {string} id.path.required - The article ID
   * @returns {Article.model} 200 - Article
   * @returns {Response.model}  default - Unexpected error
   * @security JWT
   */
  .get(async (req, res, next) => {
    try {
      const article = await articleBusiness.getById(req.params.id);

      if (!article) return res.status(404).send();

      res.json(responseFactory.success(article));
    } catch (e) {
      next(e);
    }
  })
  /**
   * Update article by Id
   * @group Articles - Operations to manipulate Articles
   * @operationId articlePatchById
   * @route PATCH /articles/{id}
   * @produces application/json
   * @param {string} id.path.required - The article ID
   * @param {ArticleMutation.model} article.body.required - Article payload
   * @returns {Article.model} 200 - Article
   * @returns {Response.model}  default - Unexpected error
   * @security JWT
   */
  .patch(mandatoryAuthInterceptor([roles.ADMIN, roles.CONTRIBUTOR]), async (req, res, next) => {
    try {
      const articleParam = Validator.validate(req.body, articleSchema.articleResource.body, errorCodes.ARTICLES.INVALID_PAYLOAD);
      articleParam.id = req.params.id;

      const article = await articleBusiness.update(articleParam, req.user);

      res.json(responseFactory.success(article));
    } catch (e) {
      next(e);
    }
  })
  /**
   * Detele article by Id
   * @group Articles - Operations to manipulate Articles
   * @operationId articleDelete
   * @route DELETE /articles/{id}
   * @produces application/json
   * @param {string} id.path.required - The article ID
   * @returns {string} 200 - Success
   * @returns {Response.model}  default - Unexpected error
   * @security JWT
   */
  .delete(mandatoryAuthInterceptor([roles.ADMIN, roles.CONTRIBUTOR]), async (req, res, next) => {
    try {
      await articleBusiness.remove(req.params.id);

      res.json(responseFactory.success());
    } catch (e) {
      next(e);
    }
  });

module.exports = router;