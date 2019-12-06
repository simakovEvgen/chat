var express = require('express');
var router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

/* GET Welcome. */
router.get('/', (req, res) => {
  res.render('welcome');
});

/* GET Dashboard. */
router.get('/dashboard', ensureAuthenticated, (req, res) => {
  res.render('dashboard', {
    name: req.user.name
  });
});

module.exports = router;
