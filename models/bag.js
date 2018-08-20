'use strict'

let mongoose = require('mongoose');

let bagSchema = new mongoose.Schema({
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

let Bag = mongoose.model('Bag', bagSchema);

module.exports = Bag;