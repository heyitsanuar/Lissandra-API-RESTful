'use strict'

//Modules
let jwt    = require('jwt-simple');
let moment = require('moment');

//Secret pass to encrypt token
let secret = 'Just think of tacos as a gold mine.';

exports.ensureAuth = function(req, res, next){

    if(!req.headers.authorization){
        return res.status(403).send({message: 'Request has no authentication header.'});
    }

    let token = req.headers.authorization.replace(/['"]+/g,'');

    try{
        var payload = jwt.decode(token, secret);    

        //Checks whether the token has expired or not depending on UNIX lifespan
        if(payload.sub && (payload.exp <= moment().unix()) ){
            return res.status(401).send({message: 'Token has expired.'});
        }

    }catch(ex){
        return res.status(404).send({message: 'Token is invalid.'});
    }

    req.user = payload;
    next();
}