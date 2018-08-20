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

// PUT '/product/:id' updates a product by its ID
function updateProduct(req, res){
    //Receiving request params
    let update = req.body;
    let productId = req.params.id;

    Product.findByIdAndUpdate(productId, update, {new: true}, (err, productUpdated) => {
        if(err)
            return res.status(500).send({message: 'Error while updating product.'});
        
        if(!productUpdated)
            return res.status(404).send({message: 'No product found'});
        
        return res.status(200).send({product: productUpdated});
    });
}

// DELETE '/product/:id' remove a product by its ID
function deleteProduct(req, res){
    //Receiving request params
    let productId = req.params.id;

    Product.findByIdAndRemove(productId, (err, productRemoved) => {
        if(err)
            return res.status(500).send({message: 'Error while removing product.'});
        
        if(!productRemoved)
            return res.status(404).send({message: 'No product found'});

        return res.status(200).send({message: 'Product removed successfully.'});
    });
}

// GET '/product/:id' looks for a product by its id
function getProduct(req, res){
    //Receiving request params
    let productId = req.params.id;

    Product.findById(productId, (err, product) => {
        if(err)
            return res.status(500).send({message: 'Error while looking for product.'});
        
        if(!product)
            return res.status(404).send({message: 'No product found.'});

        return res.status(200).send({product: product});
    });
}

// GET '/product' looks for all existing products
function getProducts(req, res){
    //Pagination setup
    let page = (req.params.page) ? req.params.page : 1;
    let itemsPerPage = 9;
    
    Product.find({}).paginate(page, itemsPerPage, (err, products, total) => {
        if(err)
            return res.status(500).send({message: 'Error while looking for products.'});
        
        return res.status(200).send({
            pages: Math.ceil(total/itemsPerPage),
            total: total,
            products: products
        });
    });
}

// GET '/product/:category/:page?' looks for products by their category
function getProductsByCategory(req, res){
    //Receiving request params
    let category = req.params.category;

    //Pagination setup
    let page = (req.params.page) ? req.params.page : 1 ;
    let itemsPerPage = 9;

    Product.find({category: category}).paginate(page, itemsPerPage, (err, products, total) => {
        if(err)
            return res.status(500).send({message: 'Error while looking for products.'});
        
        return res.status(200).send({
            pages: Math.ceil(total/itemsPerPage),
            total: total,
            products: products
        });
    
    });
}

// GET '/product/:category/:type/:page?' looks for products by their type
function getProductsByType(req, res){
    //Receiving request params
    let category = req.params.category;
    let type = req.params.type;
    
    //Pagination setup
    let page = (req.params.page) ? req.params.page : 1 ;
    let itemsPerPage = 9;
    
    Product.find({category: category, type: type}).paginate(page, itemsPerPage, (err, products, total) => {
        if(err)
            return res.status(500).send({message: 'Error while looking for products.'});
        
        return res.status(200).send({
            pages: Math.ceil(total/itemsPerPage),
            total: total,
            products: products
        });
    
    });
}

// GET '/product/:category/types' gets product types for each category
function getProductTypes(req, res){
    let category = req.params.category;

    Product.find({category: category}).distinct('type', (err, foundTypes) => {
        if(err)
            return res.status(500).send({message: 'Error while searching for types.'});
        
        return res.status(200).send({types: foundTypes});
    });
}

module.exports = {
    saveProduct,
    updateProduct,
    deleteProduct,
    getProduct,
    getProducts,
    getProductsByCategory,
    getProductsByType,
    getProductTypes
}