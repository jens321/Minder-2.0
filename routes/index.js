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

      var lat = parseFloat(req.session.user.location.geo.coordinates[1]);
      var lng = parseFloat(req.session.user.location.geo.coordinates[0]);
      User.where('location.geo')
        .near({
          center: {
            coordinates: [lng, lat],
            type: 'Point'
          },
          maxDistance: 16000
        })
        .then(function(docs) {
          results = []
          docs.forEach(function(element) {
            isValid = true;
            invalidIds.forEach(function(id) {
              if (id.toString() === element._id.toString()) {
                isValid = false
              }
            });  
            if (element._id.toString() !== req.session.user._id.toString() &&
                  isValid) {
              results.push(element)
            }
          });
          res.render('discovery', {
            title: 'Minder', 
            people: data,
            similarLocation: results
          }); 
        })
        .catch(function(err) {
          console.error(err);
          res.send(err);
        })
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
          imageUrlPath: req.session.user.imageUrlPath,
          unreadChats: req.session.user.unreadChats
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
  axios.get('https://randomuser.me/api/?inc=name,email,picture,login&results=100')
    .then(function (response) {
      users = response.data.results;  
      newUsers = []; 
      for (let i = 0; i < users.length; ++i) {
        let location = generateRandomLocation(); 
        let newUser = User({
          name: users[i].name.first + " " + users[i].name.last,
          email: users[i].email,
          password: users[i].login.password,
          description: `Hi there! My name is ${users[i].name.first} and I am a human.`,
          tags: generateRandomTags(),
          location: { geo : {
            coordinates : [
                location.coords[1], 
                location.coords[0]
            ], 
            type : "Point" },
            name: location.name
          }, 
          imageUrlPath: users[i].picture.large,
          unreadChats: 0,
          unreadConnections: 0
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

  User.find({ name: { $regex: req.params.searchQuery }, _id: { $nin: req.session.user._id } })
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
   let randomLocations = [
     { name: 'New York',
       coords: [40.7127753, -74.0059728]
     },
     {
       name: 'San Francisco',
       coords: [37.7749295, -122.41941550000001]
     }, 
      {
      name: 'Irvine',
      coords: [33.6845673, -117.82650490000003]
     }, 
      {
        name: 'Los Angeles',
        coords: [34.0522342, -118.2436849]
      },
      {
        name: 'Boston',
        coords: [42.3600825, -71.05888010000001]
      },
      {
        name: 'Cambridge',
        coords: [52.205337, 0.12181699999996454]
      }]; 
  return randomLocations[Math.floor(Math.random()*randomLocations.length)]; 
}

module.exports = router;
