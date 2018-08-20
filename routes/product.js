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
api.put('/product/:id', [MiddlewareAuth.ensureAuth, MiddlewareRole.isAdmin], ProductController.updateProduct); //Updates an existing product
api.delete('/product/:id', [MiddlewareAuth.ensureAuth, MiddlewareRole.isAdmin], ProductController.deleteProduct); //Removes a product

//Routes for listings
api.get('/product/:id', ProductController.getProduct); //Gets a product by its ID
api.get('/product', ProductController.getProducts); //Gets all existing products
api.get('/product/:category/:page?', ProductController.getProductsByCategory); //Gets products by category

module.exports = api;