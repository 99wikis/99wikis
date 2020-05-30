const express = require('express');

const authRoutes = require('./auth.route');
const articlesRoutes = require('./articles.route');
const usersRoutes = require('./users.route');

const router = express.Router();

router.get(`/`, (req, res) => res.send('Documentation at /api-docs'));

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/articles', articlesRoutes);

router.get(`/*`, (req, res) => {
  res.status(404).send('Route not found')
});

module.exports = router;
