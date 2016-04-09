// Load required packages
var mongoose = require('mongoose');

// Define our beer schema
var UserSchema   = new mongoose.Schema({
  name: {type:String, required: true},
  email: {type:String, required: true},
  pendingTasks: [String],
  dateCreated: {
    type : Date,
    default : Date.now
  }
});

// Export the Mongoose model
module.exports = mongoose.model('user', UserSchema);
