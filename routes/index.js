var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Minder' });
});

router.get('/profile', function(req, res, next) {
  if (req.session && req.session.user) {
    var User = mongoose.model('User'); 
    User.findOne({ email: req.session.user.email }, function (err, user) {
      if (!user) {
        req.session.reset(); 
        res.redirect('/'); 
      } else {
        res.render('profile', { 
          title: 'Minder', 
          name: req.session.user.name, 
          email: req.session.user.email ,
          location: req.session.user.location,
          description: req.session.user.description,
          education: req.session.user.education,
          tags: req.session.user.tags,
          imageUrlPath: req.session.user.imageUrlPath
        }); 
      }
    });
  } else {
    console.log('user was redirected to home page, session expired'); 
    res.redirect('/'); 
  }
});

router.get('/discovery', function(req, res, next) {
  res.render('discovery', {title: 'Minder'}); 
})

module.exports = router;
