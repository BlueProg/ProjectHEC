'use strict';

var mongoose = require('mongoose');

var dataUsers = new mongoose.Schema({
    userUid: String,
    dataUsers: Object
});

dataUsers.pre('save', function(next) {
    console.log('dataUsers save')
    next();
});

module.exports = mongoose.model('DataUsers', dataUsers);
