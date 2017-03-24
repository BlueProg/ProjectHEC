var express    = require('express');
var bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4);
var router = express.Router();
var request = require('request');
var path = require('path');
var User = require(path.resolve( __dirname, '../models/user'));
var DataUsers = require(path.resolve( __dirname, '../models/dataUsers'));
var SmsSend = require(path.resolve( __dirname, '../models/smsSend'));
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var Promise = require('promise');


router.use(bodyParser.json());
var userList = [];
router.route('/sendMessage')
	.post(function(req, res) {

		checkRank(req).then(function(data) {
			if (data.status == 200) {
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
				sendSms(data, req);
				res.send(data);
			}
			else {
				res.send(data);
			}	
		})
	})
	.get(function(req, res) {
		checkRank(req).then(function(data) {
			if (data.status == 200) {
				getUid(req).then(function(uid){
					SmsSend.find({'userUid': uid}, function (err, datas) {
						var dataReverse = datas.reverse();
						res.send(dataReverse);
					})
				})
			}
			else
				res.send(data);
		})
	})

router.get('/', function(req, res) {
	res.sendfile('./public/index.html');
});

router.route('/userList')
	.get(function(req, res) {
		
		checkRank(req).then(function(data) {
			if (data.status == 200) {
				getUid(req).then(function(uid){
					DataUsers.findOne({'userUid': uid}, function (err, user) {
						if (user && user.dataUsers) {
							res.send({
		            			'status': 200,
		            			'data': {
		            				'info': 'Données correctement récupéré',
		            				'data': user.dataUsers
		            			}
		            		});	
						}
						else {
							res.send({
		            			'status': 200,
		            			'data': {
		            				'info': 'Données correctement récupéré',
		            				'data': {}
		            			}
		            		});		
						}
					})
				})
			}
			else
				res.send(data);
		})
	})
	.post(function(req, res) {

		checkRank(req).then(function(data) {

			if (data.status == 200) {
				userList = req.body;

				getUid(req).then(function(uid){
					dataUsers = new DataUsers({
						userUid: uid,
						dataUsers: userList 
		            }).save(function(err, dataMongo) {
		            	if (err)
		            		console.log('Error save dataUsers: ', err);
		            	else {
		            		console.log(dataMongo);
		            		res.send({
		            			'status': 200,
		            			'data': {
		            				'info': 'Données correctement enregistré',
		            				'data': dataMongo.dataUsers
		            			}
		            		});
		            	}
		            })
				});
			}
			else
				res.send(data);
		})
	})
	.delete(function(req, res) {

		checkRank(req).then(function(data) {
			if (data.status == 200) {
				userList = [];
				getUid(req).then(function(uid){
					DataUsers.findOne({'userUid': uid}).remove().exec();
					res.send({
            			'status': 200,
            			'data': {
            				'info': 'Données correctement supprimé',
            				'data': {}
            			}
            		});
				});
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

function sendSms(data, req) {
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
            	getUid(req).then(function(uid){
	            	smsSend = new SmsSend({
	            		userUid: uid,
						expeditor: data.expeditor,
						message: data.message,
						recipients: data.tel,
						idSend: resData.message_id
	            	}).save(function(err, data) {
		            	if (err)
		            		console.log('Error save smsSend: ', err);
		            	else
		            		console.log('message save: ', data.expeditor);
		            })
		        })
            }
            else
	            console.log('error smsSend', resData);
        }
        else
        	console.log(error);
    });
}

function getUid(req) {

	return new Promise( function(resolve, reject) {
		var token = req.headers.authorization;
		jwt.verify(token, req.app.get('superSecret'), function(err, decoded) {
			resolve(decoded.uid);
		})
	})
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