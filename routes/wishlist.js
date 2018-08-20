'use strict'

let express = require('express');
let api     = express.Router();
//Middlewares
let MiddlewareAuth = require('../middlewares/authenticated');
//Controllers
let WishlistController = require('../controllers/wishlist');

api.get('/wishlist/:userId', MiddlewareAuth.ensureAuth, WishlistController.getProducts);  //Gets the existing products from the given user's wishlist
api.post('/wishlist/:userId/:productId', MiddlewareAuth.ensureAuth, WishlistController.addProduct); //Adds an item to the user's wishlist
api.delete('/wishlist/:userId/:productId', MiddlewareAuth.ensureAuth, WishlistController.deleteProduct); //Deletes an existing item from the user's wishlist

module.exports = api;