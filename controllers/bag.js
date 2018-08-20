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

module.exports = {
    getProducts
};