var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Minder' });
});

router.get('/profile', function(req, res, next) {
  res.render('profile', { title: 'Minder', name: 'Jens Tuyls', email: 'jens.tuyls@icloud.com' }); 
});

module.exports = router;
