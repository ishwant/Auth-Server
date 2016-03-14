// server.js
//TEST

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');

var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var multer       = require('multer');
var session      = require('express-session');
var crypto = require('crypto'); 

var configDB = require('./config/database.js');


// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)

app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(multer()); //for parsing multipart/form-data

// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/public')); 


//app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({ secret: 'Diabetik-Backend' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
//require('./app/routes_passport.js')(app, passport); // load our routes and pass in our app and fully configured passport
require('./app/routes.js')(app); // configure our routes
require('./app/p_routes.js')(app, passport); //patient info related routes
require('./app/c_routes.js')(app); //CaseWorker info related routes
require('./app/authRoutes.js')(app, passport); //CaseWorker info related routes

//=======TEST OF ENC-DEC=============================

cipher = function(toCrypt, key){

	// Create the 32-byte zero-filled key buffer
	keyBuf = new Buffer(Array(32));
	// Copy the key into this buffer
	keyBuf.write(key, 'utf8');

	// Create the 16-byte zero-filled IV buffer
	ivBuf = new Buffer(Array(16));

	var cipher = crypto.createCipheriv('aes256', keyBuf, ivBuf); 
	output = cipher.update(toCrypt, 'utf-8', 'base64') + cipher.final('base64');
	console.log(output);
	return output;
}

decipher = function(ciphered, key){

	// Create the 32-byte zero-filled key buffer
	keyBuf = new Buffer(Array(32));
	// Copy the key into this buffer
	keyBuf.write(key, 'utf8');

	// Create the 16-byte zero-filled IV buffer
	ivBuf = new Buffer(Array(16));

	var decipher = crypto.createDecipheriv('aes256', keyBuf, ivBuf); 
	decrypted = decipher.update(ciphered,'base64','utf-8') + decipher.final('utf-8');
	console.log(decrypted);
	return decrypted;
}
createSuper = function(){
	var authUser    = require('./app/models/authUser.js');
	authUser.findOne({"username":"g2lbuddy"}, function(err,found){
		if(found){
			console.log("Super admin exists");
		}
		else{
			var superUser = new authUser();
			superUser.unique_ID	= null;
			superUser.username = "g2lbuddy";
			superUser.password = superUser.generateHash("g2lbuddy");
			superUser.role = "super";
			superUser.first_name = "super";
			superUser.last_name = "super";
			superUser.save();
			console.log("Super user created");
		}
	});
}


//=======TEST OF ENC-DEC=============================


// launch ======================================================================
app.listen(port, function(){
	createSuper();
});
console.log('The magic happens on port ' + port);

