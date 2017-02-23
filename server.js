
var express = require('express');
var app = express();
var bodyParser = require('body-parser'); // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var router = express.Router();

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

var userList = [
		{ "name" : "Marc", isChecked: false, "list" : ["2016"]},
		{ "name" : "Jean", isChecked: false, "list" : ["2017"]},
		{ "name" : "Pierre", isChecked: false, "list" : ["2016", "2017"]},
		{ "name" : "Jean", isChecked: false, "list" : ["2016"]},
		{ "name" : "Pierre", isChecked: false, "list" : ["2017"]},
		{ "name" : "Jean", isChecked: false, "list" : ["2016"]},
		{ "name" : "Nicolas", isChecked: false, "list" : ["2017"]}
	];

router.use(function(req, res, next) {
 	console.log(req.method, req.url);
	next();
})

router.get('/', function(req, res) {
	res.sendfile('./public/index.html');
});

router.get('/userList', function(req, res) {
	res.json(userList);
});

app.use('/', router);

app.listen(8080);
console.log("App listening on port 8080");
