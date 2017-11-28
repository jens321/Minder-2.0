var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var session = require('client-sessions');
var User = require('../models/user.js'); 
var fs = require('fs'); 
var Chat = require('../models/chat.js');
var socketio = require('../socketio'); 

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// -------------------------- SIGNUP/LOGIN ROUTES --------------------------

router.post('/signup', function(req, res, next) { 

  // build new user object from req.body
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    location: "",
    education: "",
    description: "",
    tags: [],
    connections: [],
    pending: [],
    invitations: [], 
    imageUrlPath: "images/profile.jpg",
    unreadChats: 0,
    unreadConnections: 0 
  }); 

  // save user to the database
  user.save(function (err, user) {
    if (err) throw err; 
    req.session.user = user; 
    res.send(user); 
  }); 

}); 

router.post('/login', function (req, res, next) { 
  User.findOne({ email: req.body.email }, function(err, user)  {
    if (err) throw err;
    if (user.password === req.body.password) { 
      req.session.user = user; 
      res.send(user);  
    } else {
      console.log('invalid email or password') 
    }
  }); 

});

// -------------------------- CONNECT ROUTES --------------------------

router.post('/connect/:id', function(req, res, next) { 

  User.findByIdAndUpdate(req.session.user._id, { $push: { pending: req.params.id } }, { new: true }, function(err, newUser1) {
    if (err) throw err; 

    req.session.user = newUser1; 

    User.findByIdAndUpdate(req.params.id, { $push: { invitations: req.session.user._id }}, { new: true }, function(err, newUser2) {
      if (err) throw err; 
      
      socketio.sockets()[req.params.id].emit('notification', {
        type: 'new_connection',
        sender: newUser1.name 
      });

      res.end(); 
    }); 

  });
});

router.patch('/connect/accept/:id', function(req, res, next) {

  User.findByIdAndUpdate(req.session.user._id, {
     $pull: { invitations: req.params.id }, 
     $push: { connections: req.params.id } 
    },{ new: true }, function(err, newUser) {
    req.session.user = newUser;  
    
    User.findByIdAndUpdate(req.params.id, {
      $pull: { pending: req.session.user._id },
      $push: { connections: req.session.user._id } 
    }, { new: true }, function(err, newUser) {
      res.end(); 
    });
  });

});

router.patch('/connect/cancel/:id', function(req, res, next) {
  
  User.findByIdAndUpdate(req.session.user._id, {
    $pull: { pending: req.params.id }
   },{ new: true }, function(err, newUser) {
   req.session.user = newUser;  
   
   User.findByIdAndUpdate(req.params.id, {
     $pull: { invitations: req.session.user._id }
   }, { new: true }, function(err, newUser) {
     res.end(); 
   });

 });
});

// -------------------------- CHAT ROUTES --------------------------

router.get('/chat/history', function (req, res, next) { 
  let messageHistory = []; 
  Chat.find({ 'sender': req.query.receiver, 'receiver': req.session.user._id }, function (err, messages) {
    messageHistory = messageHistory.concat(messages); 

    Chat.find({ 'receiver': req.query.receiver, 'sender': req.session.user._id }, function (err, messages) {
      messageHistory = messageHistory.concat(messages);
      
      messageHistory.sort(function (m1, m2) {
        return m1.date > m2.date; 
      }); 

      var ids = [req.session.user._id, req.query.receiver];
      ids.sort();
      var room = ids[0] + ids[1]; 

      if(socketio.sockets()[req.session.user._id]) {
        socketio.sockets()[req.session.user._id].join(`chat_${room}`);
      }
      res.status(200).json(messageHistory);  
    }); 
  });


});

router.post('/chat/increment', function(req, res, next) {
  User.findByIdAndUpdate(req.session.user._id, { $inc: { unreadChats: 1 } }, { new: true }, function (err, newUser) {
    if (err) throw err; 

    req.session.user = newUser;
    console.log(newUser);  
  });
});

router.patch('/chat/reset', function(req, res, next){
  User.findByIdAndUpdate(req.session.user._id, { $set: { unreadChats: 0 } }, { new: true }, function(err, newUser) {
    if (err) throw err; 

    req.session.user = newUser;
    console.log(newUser); 
  });
});

router.post('/chat/:id', function (req, res, next) {
  let message = Chat({
    sender: req.session.user._id,
    receiver: req.body.receiver,
    message: req.body.message,
    date: Date.now()
  }); 

  message.save(function(err, newMessage) {
    if (err) throw err;

    // increment unreadChats counter for receiver
    User.findByIdAndUpdate(req.body.receiver, { $inc: { unreadChats: 1 } }, { new: true }, function (err, newUser) {
      if (err) throw err; 
  
      // create unique id to identify socket room for private messaging
      var ids = [req.session.user._id, req.body.receiver];
      ids.sort();
      var room = ids[0] + ids[1]; 
  
      User.findById(req.session.user._id, function(err, senderUser) {
        socketio.instance().to(`chat_${room}`).emit('chat', newMessage);
        socketio.sockets()[req.body.receiver].emit('notification', {
          type: 'new_message',
          data: newMessage,
          sender: senderUser.name
        });
        res.end(); 
      }).select('name');
    });

  });

}); 

// -------------------------- PROFILE ROUTES --------------------------

router.get('/:id', function(req, res, next) {
  User.findById(req.params.id, function(err, user) {
    if (err) throw err; 
    delete user.password;
    res.render('view-user', {title: 'Minder', user: user}); 
  });
});

router.patch('/', function (req, res, next) {  
  if (req.body.image) { 
    var buffer = new Buffer(req.body.image, 'base64');
    fs.writeFileSync(`${__dirname}/../public/images/profile/${req.session.user._id}.png`, buffer);
    req.body.imageUrlPath = `../images/profile/${req.session.user._id}.png`; 
    delete req.body.image; 
  }

  User.findByIdAndUpdate(req.session.user._id, req.body, {new: true}, function(err, newUser) {
    if (err) throw err;   
    
    req.session.user = newUser   
    res.status(200).json(newUser);   
  }); 
});

router.delete('/', function (req, res, next) {
  User.findByIdAndRemove(req.session.user._id, function (err, user) {
    req.session.reset(); 
    res.status(200).send('user successfully deleted');
  });
}); 

module.exports = router;
