
var express = require('express');
var app = express();
var bodyParser = require('body-parser'); // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var router = express.Router();
const nodemailer = require('nodemailer');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

var userList = [];
let transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'HecSpred@gmail.com',
		pass: ''
	}
});

var mailOptions = {
    from: '"Fred Foo 👻" <foo@blurdybloop.com>',
    to: 'exampleEmail@yopmail.com',
    subject: 'Hello ✔',
    text: 'Hello world ?'
};

// send mail with defined transport object
function sendMail(data) {
	transporter.sendMail(data, (error, info) => {
	    if (error) {
	        return console.log(error);
	    }
	    console.log('Message %s sent: %s', info.messageId, info.response);
	});	
}

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
		for (var i = req.body.length - 1; i >= 0; i--) {
			var data = req.body[i];
			data.isChecked = false;
			data.list = data.list.split(',').map(function (item) {
				return item.trim();
			});
			userList.push(data);
		}
		res.send(userList);
	});

router.route('/sendMessage')
	.post(function(req, res) {
		console.log(req.body);
		mailOptions.subject = req.body.title;
		mailOptions.text = req.body.message;
		console.log(mailOptions);
		sendMail(mailOptions);
		res.send(200);
	});

app.use('/', router);

app.listen(8080);
console.log("App listening on port 8080");
