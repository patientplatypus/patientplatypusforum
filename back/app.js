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
var usersRouter = require('./routes/users');
var cors = require('cors')
var mongoose = require('mongoose');

var app = express();
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));

var server = require('http').Server(app);
var io = require('socket.io').listen(server, { origins: '*:*'}); 

server.listen(5000)

app.use(function(req, res, next) {
  req.io = io;
  next();
});

io.sockets.on('connection', function (socket) {
  socket.emit("connection established", "connection established")
  socket.on('addFeed', (item)=>{
    console.log('inside addFeed and value of item: ', item)
    io.sockets.emit('feedItem', item)
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

mongoose.connect("mongodb://localhost:27017/anotherDB14");
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
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
  res.render('error');
});

module.exports = app;
