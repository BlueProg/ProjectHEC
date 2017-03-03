var request = require('request');
var express = require('express');
var app = express();
var bodyParser = require('body-parser'); // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var router = express.Router();
const nodemailer = require('nodemailer');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

var userList = [];

/* Start Mail */

let transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: '',
		pass: ''
	}
});

var mailOptions = {
    from: '"Fred Foo 👻" <foo@blurdybloop.com>',
    to: 'exampleEmail@yopmail.com',
    subject: 'Hello ✔',
    text: 'Hello world ?'
};

function sendMail(data) {
	transporter.sendMail(data, (error, info) => {
	    if (error) {
	        return console.log(error);
	    }
	    console.log('Message %s sent: %s', info.messageId, info.response);
	});	
}
/* End Mail */

function sendSms() {
	request({
		headers: {'content-type' : 'application/x-www-form-urlencoded'},
	    url: 'http://www.smsenvoi.com/getapi/sendsms/',
	    method: 'GET',
	    qs: {
	    	'email': "",
	    	'apikey': "",
	    	'message[content]': "autre test",
	    	'message[senderlabel]': "Expediteur",
	    	'message[recipients]': '+33',
	    	'message[subtype]': "LOWCOST",
	    	'message[type]': "sms"
	    },
	},
    function (error, response, body) {
    	if (!error && response.statusCode == 200) {
            console.log(body)
        }
        else
        	console.log(error);
    });
}

router.use(function(req, res, next) {
 	console.log(req.method, req.url);
 	console.log(req.body);
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

		userList = req.body;
		res.send(userList);
	})
	.delete(function(req, res) {

		userList = [];
		res.send(userList);
	});

/* Email fonction */

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

app.listen(8080 || process.env.port);
console.log("App listening on port 8080");
