'use strict'

let mongoose = require('mongoose');

let wishlistSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        }
    ]
});

let Wishlist = mongoose.model('Wishlist', wishlistSchema);

module.exports = Wishlist;