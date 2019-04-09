require('dotenv').config()
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
const fileUpload = require('express-fileupload')
// var feed = require('../feed/feed')

var indexRouter = require('./routes/index');

var adminRouter = require('./routes/admin');
var blogRouter = require('./routes/blog');
var chatRouter = require('./routes/chat');
var forumRouter = require('./routes/forum');
var newsPaperRouter = require('./routes/newspaper');

var cors = require('cors')
var mongoose = require('mongoose');
// var axios = require('axios');
// var fetch = require('fetch')
var request = require('request');

var app = express();
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));


var server = require('http').Server(app);
var io = require('socket.io').listen(server, { origins: '*:*'}); 

server.listen(8000)

app.use(function(req, res, next) {
  req.io = io;
  next();
});

io.sockets.on('connection', function (socket) {
  socket.emit("connection established", "connection established")
  socket.on('addFeed', (item)=>{
    if(item.length<=200){
      console.log('inside addFeed and value of item: ', item)
      io.sockets.emit('feedItem', item)
    }
  })
  socket.on('disconnect', function() {
    console.log("disconnect: ", socket.id);
  });
  socket.on('heartbeat', (msg)=>{
    console.log('heart beats bump da-', msg)
  })
  socket.on('addChat', (payload)=>{
    io.sockets.emit('chatItem', payload);
  })
});

mongoose.connect("mongodb://host.docker.internal:27017/anotherDB24");
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
  // we're connected!
  console.log('connected to mongoose db')
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

process.on('unhandledRejection', (reason, promise) => {
  console.log('Hey! Unhandled Rejection at:', reason.stack || reason)
})

app.use(bodyParser.json()) // handle json data
app.use(bodyParser.urlencoded({ extended: true })) // handle URL-encoded data
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(fileUpload());
app.use(express.static(path.join(__dirname, 'picFolder')));

app.use((req, res, next)=>{
  console.log('inside testing captcha (if it exists)')
  console.log('and value of req.path: ', req.path)
  if (req.path=='/forum/uploadPost'||req.path=='/admin/confirmPass'||req.path=='/contact'||req.path=='/newspaper/addHeadline'){
    var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + process.env.recaptchaSecretKey + "&response=" + req.body.captcha;
    request(verificationUrl,function(error,response,body) {
      if (error){
        res.json({recaptcha: 'error'})
      }
      body = JSON.parse(body);
      console.log('value of recaptcha body: ', body)
      if(body.success !== undefined && !body.success) {
        return res.json({recaptcha: "Failed captcha verification"});
      }
      next()
    });
  }else{
    next();
  }
})

app.use('/', indexRouter);

app.use('/admin', adminRouter);
app.use('/blog', blogRouter);
app.use('/chat', chatRouter);
app.use('/forum', forumRouter);
app.use('/newspaper', newsPaperRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  console.log('there was an error: ', err)
  // res.render('error');
});

module.exports = app;
