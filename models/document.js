var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = require('./user');
const DocumentSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
   },
  title: {
    required: true,
    type: String
  },
  collaborators: {
    type: Array
  }
});


module.exports = mongoose.model('Document', DocumentSchema);
