let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let axios = require('axios'); 
let User = require('../models/user.js');  

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Minder' });
});

router.get('/profile', function(req, res, next) {
  if (req.session && req.session.user) { 
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

  // filter for people with similar tags
  User.find({ tags: { $in: req.session.user.tags }, _id: { $nin: [req.session.user._id] } })
    .then(function (data) {
      res.render('discovery', {
        title: 'Minder', 
        people: data
      }); 
    }); 
})

router.get('/chat', function(req, res, next) {
  let id = ["5a0954ecb4f2e4bd013b5a1b", "5a0954ecb4f2e4bd013b5a1c", "5a0954ecb4f2e4bd013b5a1d", "5a0953b8e905afbc3bedd43a"]; 
  User.find({ '_id': id }, function(err, friends) {
    res.render('chat', { title: 'Minder', friends: friends}); 
  });
});


router.get('/search/:searchQuery', function(req, res, next) {
  console.log(req.params); 
  if(req.params.searchQuery.trim() === '') return res.end();

  User.find({ name: { $regex: req.params.searchQuery } })
    .select("name description imageUrlPath")
    .then(function (data) {
      res.json(data);  
    });

});

router.get('/random', function(req, res, next) { 
  axios.get('https://randomuser.me/api/?inc=name,email,picture,login&results=10')
    .then(function (response) {
      users = response.data.results;  
      newUsers = []; 
      for (let i = 0; i < users.length; ++i) {
        let newUser = User({
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
  let randomTags = ['hanging out with friends', 'hiking', 'swimming', 'HTML', 'CSS', 'JavaScript', 'reading', 'basketball', 'ice skating', 'coding', 'studying', 'Netflix', 'Game of Thrones'];
  let tagCount = Math.floor(Math.random()*randomTags.length);
  let tagList = []; 

  let seen = {}; 
  for (let i = 0; i < tagCount; ++i) {
    let element = randomTags[Math.floor(Math.random()*randomTags.length)]
    if (!seen.hasOwnProperty(element)) {
      seen[element] = true; 
      tagList.push(element);
    }
  }

  return tagList; 
}

function generateRandomLocation() {
  let randomLocations = ['New York', 'San Francisco', 'Irvine', 'Los Angeles', 'Boston', 'Cambridge'];
  return randomLocations[Math.floor(Math.random()*randomLocations.length)]; 
}

module.exports = router;
