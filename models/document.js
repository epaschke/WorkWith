var mongoose = require('mongoose');
var Schema = mongoose.Schema;

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
  },
  editorState: {
    type: Object,
    default: {}
  }
});


module.exports = mongoose.model('Document', DocumentSchema);
