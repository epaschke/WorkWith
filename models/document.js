var mongoose = require('mongoose');
var Schema = mongoose.Schema;

export const DocumentSchema = new Schema({
  author: {
    required: true,
    type: String
  },
  title: {
    required: true,
    type: String
  },
  collaborators: {
    required: true,
    type: Array
  },
})
