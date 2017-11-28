let mongoose = require('mongoose'); 

let userSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
    description: String,
    tags: [String],
    connections: [String],
    pending: [String], 
    invitations: [String],  
    education: String,
    location: Object,
    imageUrlPath: String,
    unreadChats: Number,
    unreadConnections: Number
   });

userSchema.index({'location.geo': '2dsphere'});
let User = mongoose.model('User', userSchema);

module.exports = User; 