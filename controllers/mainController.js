var express    = require('express');
var bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4);
var router = express.Router();
var request = require('request');
var path = require('path');
var User = require(path.resolve( __dirname, '../models/user'));
var SmsSend = require(path.resolve( __dirname, '../models/smsSend'));
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var Promise = require('promise');


router.use(bodyParser.json());
var userList = [];
router.route('/sendMessage')
	.post(function(req, res) {

		checkRank(req).then(function(data) {
			console.log('/sendMessage');
			if (result.status == 200) {
				console.log('/sendMessage entre');
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

				res.send(result);
			}
			else {
				console.log('/sendMessage non');
				res.send(result);
			}	
		})
	});

router.get('/', function(req, res) {
	res.sendfile('./public/index.html');
});

router.route('/userList')
	.get(function(req, res) {
		
		checkRank(req).then(function(data) {

			if (data.status == 200) {
				data.data.data = userList;
				res.json(data);
			}
			else
				res.send(data);
		})
	})
	.post(function(req, res) {
		
		
		checkRank(req).then(function(data) {

			if (data.status == 200) {
				userList = req.body;
				data.data.data = userList;
				res.send(data);
			}
			else
				res.send(data);
		})
	})
	.delete(function(req, res) {

		checkRank(req).then(function(data) {
			if (data.status == 200) {
				userList = [];
				data.data.data = userList;
				res.send(data);
			} else
				res.send(data);
		})
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

function checkRank(req) {

	return new Promise( function(resolve, reject) {
		if (req.headers && req.headers.authorization)
			var token = req.headers.authorization;
		else {
			resolve ({
				'status': 400,
				'data': {
					'info': 'Problème d\'identifiant, merci vous reconnectez 1'
				}
			});
		}

		if (token) {
			jwt.verify(token, req.app.get('superSecret'), function(err, decoded) {
	  			if (err) {
					resolve ({
						'status': 400,
						'data': {
							'info': 'Problème d\'identifiant, merci vous reconnectez 2'
						}
					});
	  			}
	  			else {
	  				User.findById(decoded.uid, function (err, user) {
	  					if (err) {
	  						console.log("databe error: ", err);
	  					}
	  					else {
	  						if (user.rank == 2) {
	  							resolve ({
									'status': 200,
									'data': {
										'info': 'Ok'
									}
								});
	  						}
	  						else {
								resolve ({
									'status': 400,
									'data': {
										'info': 'Vous n\'avez pas les droits requits'
									}
								});
	  						}
	  					}
	  				});
	  			}
			});
		}
	})
}

module.exports = router;