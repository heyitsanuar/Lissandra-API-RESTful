'use strict'

//Modules
let express = require('express');
let api     = express.Router();

//Middlewares
let MiddlewareAuth = require('../middlewares/authenticated');
//Controllers
let UserController = require('../controllers/user');

api.post('/login', UserController.login); //Signs in an existing user
api.post('/user', UserController.saveUser); //Saves a new user
api.put('/user/:id', MiddlewareAuth.ensureAuth, UserController.updateUser); //Updates an existing user by its id

module.exports = api;