'use strict'

//Modules
let express    = require('express');
let bodyParser = require('body-parser');

//App instance
let app = express();

//Middlewares
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//CORS setup
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
	res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');

	next();
});

module.exports = app;