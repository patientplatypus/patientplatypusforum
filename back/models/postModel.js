var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PostSchema = new Schema({
  body: {type: String, required: true, max: 2000},
  created: { type: Date, default: Date.now },
  flags: {type: Number, default: 0},
  comments: [CommentSchema]
}, {
  writeConcern: {
    w: 0,
    j: false,
    wtimeout: 200
  }  
});

module.exports = mongoose.model('PostSchema', PostSchema);