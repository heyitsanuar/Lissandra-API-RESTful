'use strict'

//Modules
let express = require('express');
let api     = express.Router();

//Middlewares
let MiddlewareAuth = require('../middlewares/authenticated');
//Controllers
let UserController = require('../controllers/user');

api.post('/login', UserController.login); //Signs in an existing user

module.exports = api;