'use strict'

let mongoose = require('mongoose');
let app      = require ('./app');
let port     = process.env.PORT || 3000; //If environment variable exists

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://anuar:taquitos21@ds143511.mlab.com:43511/lissandra')
        .then(() => {
            console.log('Connection to DB successful');
            
            //Loading server
            app.listen(port, () => console.log('Server running on port '+ port));
        })
        .catch(err => console.log(err));