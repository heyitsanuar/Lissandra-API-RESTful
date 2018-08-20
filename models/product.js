'use strict'

let mongoose = require('mongoose');

let productSchema = new mongoose.Schema({
    name: String,
    description: String,
    cost: String,
    category: String,
    type: String,
    images: [String],
    sale: { type: String, default: null }
});

let Product = mongoose.model('Product', productSchema);

module.exports = Product;