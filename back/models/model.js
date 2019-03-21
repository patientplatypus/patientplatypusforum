var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommentSchema = new Schema({
  body: {type: String, required: true, max: 2000},
  created: { type: Date, default: Date.now },
  flags: {type: Number, default: 0},
  fileName: {type: String, default: ""}
}, {
  writeConcern: {
    w: 0,
    j: false,
    wtimeout: 200
  }  
});

var PostSchema = new Schema({
  body: {type: String, required: true, max: 2000},
  created: { type: Date, default: Date.now },
  flags: {type: Number, default: 0},
  fileName: {type: String, default: ""},
  board: {type: String, default: ""},
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }]
}, {
  writeConcern: {
    w: 0,
    j: false,
    wtimeout: 200
  }  
});

var BlogSchema = new Schema({
  title: {type: String},
  bodyArr: [{type: String}],
  fileArr: [{type: String}],
  created: {type: Date, default: Date.now()},
}, {
  writeConcern: {
    w: 0,
    j: false,
    wtimeout: 200
  }  
})

var Post =  mongoose.model('Post', PostSchema);
var Comment = mongoose.model('Comment', CommentSchema)
var Blog = mongoose.model('Blog', BlogSchema)

module.exports = {Post, Comment, Blog} 