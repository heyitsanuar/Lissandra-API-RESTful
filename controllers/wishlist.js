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

module.exports = {
    getProducts
};