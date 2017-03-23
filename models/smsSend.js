'use strict';

var mongoose = require('mongoose');

var smsSendSchema = new mongoose.Schema({

    expeditor: String,
    message: String,
    idSend: String,
    userUid: String,
    date: String
});

smsSendSchema.pre('save', function(next) {
    console.log('smsSend save')
    this.date = new Date().toISOString();
    next();
});

module.exports = mongoose.model('SmsSend', smsSendSchema);
