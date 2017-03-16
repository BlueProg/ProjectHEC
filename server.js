var express = require('express');
var app = express();
var router = express.Router();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var http = require('http');
var url = '';
var authController = require('./controllers/authController');
var mainController = require('./controllers/mainController');

try {
    var config = require('./config');
    url = config.mongodb;
} catch (ex) {
    url = process.env.MONGODB_URI;
}

mongoose.connect(url);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function () {


  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json());
  app.use(cookieParser())
  app.use(session({secret: 'keyboard cat'}))
  app.use('/auth', authController);
  app.use('/', mainController);
  app.use(express.static(__dirname + '/public'));
  app.use(function (req, res, next) {
      console.log('----------- request receved -----------');
      console.log(req.method, req.url);
      console.log(req.body);
      console.log('----------- request start -----------');
      next();
  });
  http.createServer(app).listen(process.env.PORT || 3000);
  console.log('Server started on port ' + (process.env.PORT || 3000));
})
