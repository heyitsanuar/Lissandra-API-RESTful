'use strict';

//Models
let Bag = require('../models/bag');

// GET '/bag/:userId' Gets the existing products from the given user's bag
function getProducts(req, res){
    //Allocating received variables from params
    let userId = req.params.userId;

    Bag.find({user: userId}).populate('products').exec((err, bag) => {
        if(err)
            return res.status(500).send({message: 'Error while loading bag.'});
        
        return res.status(200).send({bag: bag});
    });
}

// POST '/bag/:userId/:productId' Adds an item to the user's bag
function addProduct(req, res){
    //Allocating received variables from params
    let params = req.params;
    let userId = params.userId;
    let productId = params.productId;
    //Making a flag statement if the product whether the product is listed or not
    let isOnList = false;

    Bag.findOne({user: userId}).populate('products').exec((err, bag) => {
        if(err)
            return res.status(500).send({message: 'Error while loading bag.'});
            
        //Checking if bag exists, if not, it will be created
        if(!bag){
            let newBag = new Bag();
            newBag.user = userId;
            bag = newBag;
        }else{
            //Checking if product is on list
            bag.products.forEach(currentProduct => {
                if(currentProduct == productId){
                    isOnList = true;
                }
            });
        }

        //If products is listed, then it won't be taken into account and a message will be returned
        if(isOnList)
            return res.status(200).send({message: 'Product is already on list.'});
        
        //Adding product as the last item of the list, afterwards the lis will be saved
        bag.products.unshift(productId);
        
        bag.save((err, bagUpdated) => {
            if(err)
                return res.status(500).send({message: 'Error while saving product.'});

            if(!bagUpdated)
                return res.status(404).send({message: 'Product could not be saved.'});
            
            return res.status(200).send({bag: bagUpdated});
        });
    });
}

// DELETE '/bag/:userId/:productId' Deletes an existing item from the user's bag
function deleteProduct(req, res){
    //Allocating received variables from params
    let params = req.params;
    let userId = params.userId;
    let productId = params.productId;

    Bag.findOne({user: userId, products: { $in: [productId]} }, (err, bag) => {
        if(err)
            return res.status(500).send({message: 'Error while loading bag.'});
        
        if(!bag)
            return res.status(404).send({message: 'Bag not found.'});

        //Moving products to temporal product array
        let products = bag.products;
        let indexToRemove = products.indexOf(productId);

        //Removing the index from the array
        products.splice(indexToRemove, 1);
        bag.products = products;
        
        bag.save((err, bagUpdated) => {
            if(err)
                return res.status(500).send({message: 'Error while saving product.'});
            
            bagUpdated.populate('products', () => {
                return res.status(200).send({bag: bagUpdated})
            });
        });
    });
}

module.exports = {
    getProducts,
    addProduct,
    deleteProduct
};