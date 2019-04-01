var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommentSchema = new Schema({
  body: {type: String, required: true, max: 2000},
  created: { type: Date, default: Date.now },
  flags: {type: Number, default: 0},
  lastFlag: {type: Date, default: Date.now()},
  imageBanned: {type: Boolean, default: false},
  type: {type: String, default: 'preview'},
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
  lastFlag: {type: Date, default: Date.now()},
  fileName: {type: String, default: ""},
  imageBanned: {type: Boolean, default: false},
  board: {type: String, default: ""},
  type: {type: String, default: 'preview'},
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
  bodyArr: [{value: {type:String}, index: {type:Number}, type: {type: String, default: "body"}}],
  fileArr: [{fileName: {type:String}, index: {type:Number}, data: {type:String}, type: {type: String, default:"file"}, ext: {type: String}}],
  dateText: {type: String},
  created: { type: Date, default: Date.now },
}, {
  writeConcern: {
    w: 0,
    j: false,
    wtimeout: 200
  }  
})

var PinSchema = new Schema({
  lat: {type: Number},
  lng: {type: Number},
  visits: {type: Number, default: 0}
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
var Pin = mongoose.model('Pin', PinSchema)

module.exports = {Post, Comment, Blog, Pin} 