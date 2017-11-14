let mongoose = require('mongoose'); 

let chatSchema = mongoose.Schema({
    sender: String,
    receiver: String,
    message: String,
    date: Date 
});

let Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat; 