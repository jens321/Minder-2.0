let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let axios = require('axios'); 
let User = require('../models/user.js');  

// GET Home Page
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Minder' });
});

// GET Discovery
router.get('/discovery', function(req, res, next) {
  // filter for people with similar tags
  let connections = req.session.user.connections.map(function(element) {
    return mongoose.Types.ObjectId(element); 
  }); 
  let pending = req.session.user.pending.map(function(element) {
    return mongoose.Types.ObjectId(element);
  });
  let invitations = req.session.user.invitations.map(function(element) {
    return mongoose.Types.ObjectId(element);
  });

  invalidIds = connections.concat(pending, invitations);
  invalidIds.push(req.session.user._id);    

  User.find({ tags: { $in: req.session.user.tags }, _id: { $nin: invalidIds  } })
    .then(function (data) {
      res.render('discovery', {
        title: 'Minder', 
        people: data
      }); 
    }); 
}); 

// GET Chat
router.get('/chat', function(req, res, next) {
  User.find({ '_id': req.session.user.connections }, function(err, connections) {
    res.render('chat', { title: 'Minder', connections: connections, id: req.session.user._id }); 
  }).select("name _id"); 
});

// GET Connect
router.get('/connect', function(req, res, next) { 
  User.find({ _id: { $in: req.session.user.invitations } })
    .then(function (invitations) {
      User.find({ _id: { $in: req.session.user.pending } })
        .then(function (pending) {
          res.render('connect', { title: 'Minder', invitations: invitations, pending: pending }); 
        }); 
    }); 
});

// GET Profile
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

// GET Logout
router.get('/logout', function (req, res, next) {
  req.session.reset();
  res.redirect('/'); 
});

// GET Random
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


router.get('/search/:searchQuery', function(req, res, next) { 
  if(req.params.searchQuery.trim() === '') return res.end();

  User.find({ name: { $regex: req.params.searchQuery } })
    .select("name description imageUrlPath")
    .then(function (data) {
      res.json(data);  
    });
});

// --------- Helper Functions ---------

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
