var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    required: true,
    type: String
  },
  password: {
    required: true,
    type: String
  },
  documents: {
    type: Array
  }
});

module.exports = mongoose.model('User', UserSchema);
