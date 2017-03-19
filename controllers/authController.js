var express    = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var http = require('http'),
    hash = require('./pass').hash;
var router = express.Router();
var User = require(path.resolve( __dirname, '../models/user'));
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens

function authenticate(email, pass, fn) {

    console.log('authenticate');

    User.findOne({
        email: email
    },

    function (err, user) {
        console.log(user);
        if (user) {
            if (err) return fn(new Error('cannot find user'));
            hash(pass, user.salt, function (err, hash) {
                if (err) return fn(err);
                if (hash == user.hash) return fn(null, user);
                fn(new Error('invalid password'));
            });
        } else {
            return fn(new Error('cannot find user'));
        }
    });
}

function emailExist(req, res, next) {
    User.count({
        email: req.body.email
    }, function (err, count) {
        if (count === 0) {
            next();
        } else {
            res.send({ 'status': 400, "data" : { "info" : "Email Exist"}});
        }
    });
}

router.post("/signup", emailExist, function (req, res) {
    var password = req.body.pass;
    var username = req.body.user;
    var email = req.body.email;

    /* Verif les data ! */

    hash(password, function (err, salt, hash) {
        if (err) throw err;
        var user = new User({
            username: username,
            email: email,
            rank: 1,
            salt: salt,
            hash: hash,
        }).save(function (err, newUser) {
            if (err) throw err;
            authenticate(newUser.email, password, function(err, user){

                if (err)
                    console.log("err: ", err);
                else if(user){
                    var token = jwt.sign({
                        'uid' : user._id,
                        'username': user.username,
                        'rank': user.rank
                    }, req.app.get('superSecret'), {
                      expiresIn: 1440
                    });
                    var result = {
                        'status': 200,
                        'data': {
                            'token': token,
                            'info': 'Vous êtes correctement enregistré.'
                        }
                    }
                    res.send(result);
                }
            });
        });
    });
});

router.post("/login", function (req, res) {

    authenticate(req.body.email, req.body.pass, function (err, user) {
        if (err) {
            console.log('err: ', err);
        }
        if (user) {
            var token = jwt.sign({
                'uid' : user._id,
                'username': user.username,
                'rank': user.rank
            }, req.app.get('superSecret'), {
              expiresIn: 1440
            });
            var result = {
                'status': 200,
                'data': {
                    'token': token,
                    'info': 'Vous êtes correctement connecté.'
                }
            }
            res.send(result);
        } else {
            var result = {
                'status': 400,
                'data': {
                    'info': 'Error login or password'
                }
            }
            res.send(result);
        }
    });
});

function requiredAuthentication(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        req.session.error = 'Access denied!';
        res.redirect('/login');
    }
}

router.get('/logout', function (req, res) {

    req.session.destroy(function () {
        res.redirect('/');
    });
});

router.get('/profile', requiredAuthentication, function (req, res) {
    res.send('Profile page of '+ req.session.user.username +'<br>'+' click to <a href="/logout">logout</a>');
});


module.exports = router;