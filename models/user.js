let mongoose = require('mongoose'); 
let bcrypt = require('bcrypt'); 

let saltRounds = 10; 

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
class UserClass {
  static hashPassword(password) {
    return bcrypt.hashSync(password, saltRounds);
  }

  checkPassword(password) {
    return bcrypt.compareSync(password, this.password);
  }
}

userSchema.loadClass(UserClass);

let User = mongoose.model('User', userSchema);

module.exports = User; 