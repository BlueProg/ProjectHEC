var express    = require('express');
var bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4);
var router = express.Router();
var request = require('request');

var path = require('path');
var SmsSend = require(path.resolve( __dirname, '../models/smsSend'));


router.use(bodyParser.json());
var userList = [];
router.route('/sendMessage')
	.post(function(req, res) {
		var tel = '';
		for (var i = req.body.data.length - 1; i >= 0; i--) {
			tel += req.body.data[i].number + ',';
		}
		var data = {
			'tel': '',
			'message': ''
		};
		data.tel = tel;
		data.message = req.body.message;
		data.expeditor = req.body.expeditor;
		sendSms(data);
		res.send(200);
	});

router.get('/', function(req, res) {
	console.log('get /');
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

function sendSms(data) {
	request({
		headers: {'content-type' : 'application/x-www-form-urlencoded'},
	    url: 'http://www.smsenvoi.com/getapi/sendsms/',
	    method: 'GET',
	    qs: {
	    	'email': process.env.MAILSMS,
	    	'apikey': process.env.KEYSMS,
	    	'message[content]': data.message,
	    	'message[senderlabel]': data.expeditor,
	    	'message[recipients]': data.tel,
	    	'message[subtype]': "PREMIUM",
	    	'message[type]': "sms"
	    },
	},
    function (error, response, body) {
    	if (!error && response.statusCode == 200) {
			var resData = JSON.parse(body);
            if (resData.success) {
	            	smsSend = new SmsSend({
					expeditor: data.expeditor,
					message: data.message,
					idSend: resData.message_id
	            }).save(function(err, data) {
	            	if (err)
	            		console.log('Error save smsSend: ', err);
	            	else
	            		console.log(resData);
	            })
            }
            else
	            console.log('error smsSend', resData);
        }
        else
        	console.log(error);
    });
}


module.exports = router;