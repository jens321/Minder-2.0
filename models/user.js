var mongoose = require('mongoose'); 

var userSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
    description: String,
    tags: [String],
    education: String,
    location: String
   });

var User = mongoose.model('User', userSchema);

module.exports = User; 