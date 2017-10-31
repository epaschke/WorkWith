var mongoose = require('mongoose');
var Schema = mongoose.Schema;

export const UserSchema = new Schema({
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
})
