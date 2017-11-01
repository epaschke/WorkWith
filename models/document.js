var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const DocumentSchema = new Schema({
  author: {
    required: true,
    type: String
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
