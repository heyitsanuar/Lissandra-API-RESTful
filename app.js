'use strict'

//Modules
let express    = require('express');
let bodyParser = require('body-parser');

//App instance
let app = express();

//Middlewares
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

module.exports = app;