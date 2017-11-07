var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var axios = require('axios'); 
var User = require('../models/user.js'); 

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

router.get('/random', function(req, res, next) { 
  axios.get('https://randomuser.me/api/?inc=name,email,picture,login&results=10')
    .then(function (response) {
      users = response.data.results;  
      newUsers = []; 
      for (var i = 0; i < users.length; ++i) {
        var newUser = User({
          name: users[i].name.first + " " + users[i].name.last,
          email: users[i].email,
          password: users[i].login.password,
          description: `Hi there! My name is ${users[i].name.first} and I am a human.`,
          tags: generateRandomTags(),
          location: generateRandomLocation(),
          imageUrlPath: users[i].picture.large
        });

        newUsers.push(newUser); 

        newUser.save(function (err, newUser) {
          if (err) throw err; 
        });
      } 

      res.send(newUsers); 
    });

}); 

function generateRandomTags() {
  var randomTags = ['hanging out with friends', 'hiking', 'swimming', 'HTML', 'CSS', 'JavaScript', 'reading', 'basketball', 'ice skating', 'coding', 'studying', 'Netflix', 'Game of Thrones'];
  var tagCount = Math.floor(Math.random()*randomTags.length);
  var tagList = []; 

  var seen = {}; 
  for (var i = 0; i < tagCount; ++i) {
    var element = randomTags[Math.floor(Math.random()*randomTags.length)]
    if (!seen.hasOwnProperty(element)) {
      seen[element] = true; 
      tagList.push(element);
    }
  }

  return tagList; 
}

function generateRandomLocation() {
  var randomLocations = ['New York', 'San Francisco', 'Irvine', 'Los Angeles', 'Boston', 'Cambridge'];
  return randomLocations[Math.floor(Math.random()*randomLocations.length)]; 
}

module.exports = router;
