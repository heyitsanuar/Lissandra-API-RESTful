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

module.exports = {
    login,
    saveUser
};