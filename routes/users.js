var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var session = require('client-sessions');
var User = require('../models/user.js'); 
var fs = require('fs'); 

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', function(req, res, next) { 

  // build new user object from req.body
  var user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    location: "",
    education: "",
    description: "",
    tags: [],
    imageUrlPath: ""
  }); 

  // save user to the database
  user.save(function (err, user) {
    if (err) throw err; 
    console.log('NEW USER SAVED IN DB');
    req.session.user = user; 
    res.send(user); 
  }); 

}); 

router.post('/login', function (req, res, next) { 
  User.findOne({ email: req.body.email }, function(err, user)  {
    if (err) throw err;
    if (user.password === req.body.password) {
      console.log(user); 
      req.session.user = user; 
      res.send(user);  
    } else {
      console.log('invalid email or password') 
    }
  }); 

});

router.patch('/', function (req, res, next) { 

  

  User.update({ _id: req.session.user._id }, req.body, function(err, raw) {
    if (err) console.log(err);  
    
    req.session.user = Object.assign(req.session.user, req.body);
    console.log(req.session.user);  

    console.log('updated user successfully'); 
    res.status(200).send(req.body);   
  }); 
});

router.delete('/', function (req, res, next) {
  User.findByIdAndRemove(req.session.user._id, function (err, user) {
    req.session.reset(); 
    res.status(200).send('user successfully deleted');
  });
}); 

module.exports = router;
