
var express = require('express');
var app = express();
var bodyParser = require('body-parser'); // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var router = express.Router();

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

var userList = [
/*		{ "name" : "Marc", isChecked: false, "list" : ["2016"]},
		{ "name" : "Jean", isChecked: false, "list" : ["2017"]},
		{ "name" : "Pierre", isChecked: false, "list" : ["2016", "2017"]},
		{ "name" : "Jean", isChecked: false, "list" : ["2016"]},
		{ "name" : "Pierre", isChecked: false, "list" : ["2017"]},
		{ "name" : "Jean", isChecked: false, "list" : ["2016"]},
		{ "name" : "Nicolas", isChecked: false, "list" : ["2017"]}*/
	];

router.use(function(req, res, next) {
 	console.log(req.method, req.url);
	next();
})

router.get('/', function(req, res) {
	res.sendfile('./public/index.html');
});

router.route('/userList')
	.get(function(req, res) {
		res.json(userList);
	})
	.post(function(req, res) {
		console.log(req.body);
		for (var i = req.body.length - 1; i >= 0; i--) {
			var data = req.body[i];
			data.isChecked = false;
			data.list = data.list.split(',').map(function (item) {
				return item.trim();
			});
			userList.push(data);
		}
		console.log(userList);
		res.send(userList);
	});

app.use('/', router);

app.listen(8080);
console.log("App listening on port 8080");
