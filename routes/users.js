var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var session = require('client-sessions');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', function(req, res, next) { 

  // load in the User model
  var User = mongoose.model('User'); 

  // build new user object from req.body
  var user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
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

  // load in the User model
  var User = mongoose.model('User');

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
  var User = mongoose.model('User'); 
  
  User.update({ _id: req.session.user._id }, { name: req.body.name, email: req.body.email }, function(err, raw) {
    if (err) throw err; 
    req.session.user.name = req.body.name;
    req.session.user.email = req.body.email; 
    console.log('updated user successfully'); 
    res.status(200).send('User updated successfully!');   
  }); 
});

module.exports = router;
