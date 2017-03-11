var express    = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
var path = require('path');
var http = require('http'),
    hash = require('./pass').hash;
var router = express.Router();
var User = require(path.resolve( __dirname, '../models/user'));

router.use(bodyParser.json());

function authenticate(name, pass, fn) {

    console.log('authenticate');

    if (!module.parent) console.log('authenticating %s:%s', name, pass);

    User.findOne({
        username: name
    },

    function (err, user) {
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

function requiredAuthentication(req, res, next) {

    console.log('requiredAuthentication');

    if (req.session.user) {
        next();
    } else {
        req.session.error = 'Access denied!';
        res.redirect('/login');
    }
}

function userExist(req, res, next) {

    console.log('userExist');


    User.count({
        username: req.body.username
    }, function (err, count) {
        if (count === 0) {
            next();
        } else {
            req.session.error = "User Exist"
            res.redirect("/signup");
        }
    });
}

/*
Routes
*/
router.get("/", function (req, res) {
  console.log('path /');
    if (req.session.user) {
        res.send("Welcome " + req.session.user.username + "<br>" + "<a href='/logout'>logout</a>");
    } else {
        res.send("<a href='/login'> Login</a>" + "<br>" + "<a href='/signup'> Sign Up</a>");
    }
});

router.get("/signup", function (req, res) {
      console.log('path get /signup');

    if (req.session.user) {
        res.redirect("/");
    } else {
        res.render("signup");
    }
});

router.post("/signup", userExist, function (req, res) {
    console.log('path post /signup');
    console.log(req.body);
    var password = req.body.password;
    var username = req.body.username;
    console.log(password);
    console.log(username);
    hash(password, function (err, salt, hash) {
        console.log('before error');
        if (err) throw err;
        console.log(password);
        var user = new User({
            username: username,
            salt: salt,
            hash: hash,
        }).save(function (err, newUser) {
            console.log('before error');
            if (err) throw err;
            console.log(newUser);
            authenticate(newUser.username, password, function(err, user){
                console.log(user);
                console.log('fin');
                if(user){
                    req.session.regenerate(function(){
                        req.session.user = user;
                        req.session.success = 'Authenticated as ' + user.username + ' click to <a href="/logout">logout</a>. ' + ' You may now access <a href="/restricted">/restricted</a>.';
                        res.redirect('/');
                    });
                }
            });
        });
    });
});

router.get("/login", function (req, res) {
      console.log('path get /login');
    console.log(req.session);
    //res.render("login");
    res.send(req.session);
});

router.post("/login", function (req, res) {
      console.log('path post /login');
      console.log(req.body)
    authenticate(req.body.name, req.body.pass, function (err, user) {
        if (user) {

            req.session.regenerate(function () {

                req.session.user = user;
                req.session.success = 'Authenticated as ' + user.username + ' click to <a href="/logout">logout</a>. ' + ' You may now access <a href="/restricted">/restricted</a>.';
                res.redirect('/');
            });
        } else {
            req.session.error = 'Authentication failed, please check your ' + ' username and password.';
            res.redirect('/auth/login');
        }
    });
});

router.get('/logout', function (req, res) {
      console.log('path get /logout');

    req.session.destroy(function () {
        res.redirect('/');
    });
});

router.get('/profile', requiredAuthentication, function (req, res) {
        console.log('path get/profile');

    res.send('Profile page of '+ req.session.user.username +'<br>'+' click to <a href="/logout">logout</a>');
});


module.exports = router;