'use strict'

//Modules
let bcrypt = require('bcrypt-nodejs');
//Services
let jwt = require('../services/jwt');
//Models
let User = require('../models/user');

// POST '/api/login' signs in a user
function login(req, res){
    let params = req.body;

    let email = params.email;
    let password = params.password;

    if(!email || !password)
        return res.status(200).send({message: 'Please fill in all the fields.'});
    
    User.findOne({email: email}, (err, user) => {
        if(err)
            return res.status(500).send({message: 'Error while finding user.'});
        
        if(!user)
            return res.status(404).send({message: 'User does not exist.'});
        
        bcrypt.compare(password, user.password, (err, check) => {
            if(!check)
                return res.status(404).send({message: 'User could not login.'});

            if(params.getToken)  
                return res.status(200).send({token: jwt.createToken(user)}); //Returns token if wanted
            
            return res.status(200).send({user: user}); //Returns user data
        });
        
    })
}

// POST: '/api/user' saves a new user
function saveUser(req, res){
    
    //Collecting params sent in request
    let params = req.body;
    
    if(!params.name || !params.surname || !params.email || !params.password)
        return res.status(200).send({message: 'Please fill in all the fields.'});
    
    //Creating new user object
    let user = new User();
    
    //Allocating received values to user object
    user.name    = params.name;
    user.surname = params.surname;
    user.email   = params.email;
    user.role    = 'ROLE_USER';

    //Query which looks whether the user exists or not by using email as a parameter
    User.findOne({email: user.email.toLowerCase()}, (err, userFound) => {
        if(err)
            return res.status(500).send({message: 'There was a problem while looking for existing users.'});
        
        if(userFound)
            return res.status(404).send({message: 'User already exists.'});

        //Hashing user's password
        bcrypt.hash(params.password, null, null, (err, hash) => {
            user.password = hash;

            user.save((err, userStored) => {
                if(err)
                    return res.status(500).send({message: 'Error while saving the new user.'});
                
                if(!userStored)
                    return res.status(404).send({message: 'User could not be saved.'});

                userStored.password = undefined;
                
                return res.status(200).send({user: userStored});
            });
        });

    });
    
}

// PUT '/user/:id' updates a user depending on its ID
function updateUser(req, res){
    let update = req.body;
    let userId = req.params.id;

    //If it the ID is different from the owner's account you won't have permission to update it.
    if(userId != req.user.sub)
        return res.status(500).send({message: 'You do not have permisso to update this user.'});
    
    User.find({email: update.email.toLowerCase()}, (err, users) => {
        if(err)
            return res.status(500).send({message: 'Error ocurred while searching for the user.'});
        
        var userIsSet = false;
    
        users.forEach((user) => {
            if(user && user._id != userId)
                userIsSet = true;
        });

        if(userIsSet)
            return res.status(500).send({message: 'Email is in use already.'});

        User.findByIdAndUpdate(userId, update, {new: true}, (err, userUpdated) => {
            if(err)
                return res.status(500).send({message: 'Error ocurred while updating the user.'});

            if(!userUpdated)
                return res.status(404).send({message: 'User could not be updated.'});
            
            userUpdated.password = undefined;

            return res.status(200).send({user: userUpdated});
        });

    });

}

module.exports = {
    login,
    saveUser,
    updateUser
};