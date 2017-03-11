'use strict';

var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({

    username: String,
    password: String,
    salt: String,
    hash: String
});

userSchema.pre('save', function(next) {
    console.log('User save')
    next();
});

module.exports = mongoose.model('User', userSchema);
