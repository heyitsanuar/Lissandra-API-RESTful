'use strict'

let express = require('express');
let api     = express.Router();
//Middlewares
let MiddlewareAuth = require('../middlewares/authenticated');
//Controllers
let BagController = require('../controllers/bag');

api.get('/bag/:userId', MiddlewareAuth.ensureAuth, BagController.getProducts); //Gets the existing products from the given user's bag

module.exports = api;