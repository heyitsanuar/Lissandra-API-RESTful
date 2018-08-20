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

module.exports = {
    login
};