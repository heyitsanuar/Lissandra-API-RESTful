'use strict'

let mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
    name: String,
    surname: String,
    email: String,
    password: String,
    role: String
});

let User = mongoose.model('User', userSchema);

module.exports = User;