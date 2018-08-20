'use strict'

//Modules
let mongoosePaginate = require('mongoose-pagination');
let path             = require('path');
let fs               = require('fs');

//Models
let Product = require('../models/product');

// POST '/product' saves a new product
function saveProduct(req, res){
    //Collecting request body params
    let params = req.body;

    if(!params.name || !params.description || !params.cost || !params.category || !params.type)
        return res.status(200).send({message: 'Please fill in all the fields.'});
    
    //Creating new product object
    let product = new Product();

    //Allocating received values to product object
    product.name        = params.name;
    product.description = params.description;
    product.cost        = params.cost;
    product.category    = params.category;
    product.type        = params.type;
    product.sale        = (params.sale) ? params.sale : null;

    product.save((err, productStored) => {
        if(err)
            return res.status(500).send({message: 'Error while saving new product.'});
        
        if(!productStored)
            return res.status(404).send({message: 'Product could not be saved.'});
        
        return res.status(200).send({product: productStored});
    });
}

module.exports = {
    saveProduct
}