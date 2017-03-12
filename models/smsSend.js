'use strict';

var mongoose = require('mongoose');

var smsSendSchema = new mongoose.Schema({

    expeditor: String,
    message: String,
    idSend: String
});

smsSendSchema.pre('save', function(next) {
    console.log('smsSend save')
    next();
});

module.exports = mongoose.model('SmsSend', smsSendSchema);
