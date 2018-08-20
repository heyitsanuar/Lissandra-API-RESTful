'use strict'

//Modules
let express   = require('express');
let multipart = require('connect-multiparty');
let api       = express.Router();

//Middlewares
let MiddlewareAuth   = require('../middlewares/authenticated');
let MiddlewareRole   = require('../middlewares/role');
let MiddlewareUpload = multipart({ uploadDir: './uploads/products' });

//Controllers
let ProductController = require('../controllers/product');

//Routes

//Routes for basic CRUDs
api.post('/product', [MiddlewareAuth.ensureAuth, MiddlewareRole.isAdmin], ProductController.saveProduct); //Saves a new product

module.exports = api;