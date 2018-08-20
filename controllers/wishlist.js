'use strict';

//Models
let Wishlist = require('../models/wishlist');

// GET '/wishlist/:userId' Gets the existing products from the given user's wishlist
function getProducts(req, res){
    //Allocating received variables from params
    let userId = req.params.userId;

    Wishlist.find({user: userId}).populate('products').exec((err, wishlist) => {
        if(err)
            return res.status(500).send({message: 'Error while loading wishlist.'});
        
        return res.status(200).send({wishlist: wishlist});
    });
}

// POST '/wishlist/:userId/:productId' Adds an item to the user's wishlist
function addProduct(req, res){
    //Allocating received variables from params
    let params = req.params;
    let userId = params.userId;
    let productId = params.productId;
    //Making a flag statement if the product whether the product is listed or not
    let isOnList = false;

    Wishlist.findOne({user: userId}).populate('products').exec((err, wishlist) => {
        if(err)
            return res.status(500).send({message: 'Error while loading wishlist.'});
            
        //Checking if wishlist exists, if not, it will be created
        if(!wishlist){
            let newWishlist = new Wishlist();
            newWishlist.user = userId;
            wishlist = newWishlist;
        }else{
            //Checking if product is on list
            wishlist.products.forEach(currentProduct => {
                if(currentProduct == productId){
                    isOnList = true;
                }
            });
        }

        //If products is listed, then it won't be taken into account and a message will be returned
        if(isOnList)
            return res.status(200).send({message: 'Product is already on list.'});
        
        //Adding product as the last item of the list, afterwards the lis will be saved
        wishlist.products.unshift(productId);
        
        wishlist.save((err, wishlistUpdated) => {
            if(err)
                return res.status(500).send({message: 'Error while saving product.'});

            if(!wishlistUpdated)
                return res.status(404).send({message: 'Product could not be saved.'});
            
            return res.status(200).send({wishlist: wishlistUpdated});
        });
    });
}

// DELETE '/wishlist/:userId/:productId' Deletes an existing item from the user's wishlist
function deleteProduct(req, res){
    //Allocating received variables from params
    let params = req.params;
    let userId = params.userId;
    let productId = params.productId;

    Wishlist.findOne({user: userId, products: { $in: [productId]} }, (err, wishlist) => {
        if(err)
            return res.status(500).send({message: 'Error while loading wishlist.'});
        
        if(!wishlist)
            return res.status(404).send({message: 'Wishlist not found.'});

        //Moving products to temporal product array
        let products = wishlist.products;
        let indexToRemove = products.indexOf(productId);

        //Removing the index from the array
        products.splice(indexToRemove, 1);
        wishlist.products = products;
        
        wishlist.save((err, wishlistUpdated) => {
            if(err)
                return res.status(500).send({message: 'Error while saving product.'});
            
            wishlistUpdated.populate('products', () => {
                return res.status(200).send({wishlist: wishlistUpdated})
            });
        });
    });
}

module.exports = {
    getProducts,
    addProduct,
    deleteProduct
};