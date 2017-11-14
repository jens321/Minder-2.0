var mongoose = require('mongoose'); 

var userSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
    description: String,
    tags: [String],
    friends: [String], 
    education: String,
    location: String,
    imageUrlPath: String 
   });

var User = mongoose.model('User', userSchema);

module.exports = User; 