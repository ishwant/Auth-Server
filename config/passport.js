// config/passport.js

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;

// load up the user model
var authUser            = require('../app/models/authUser.js');
var User            = require('../app/models/user.js');

// expose this function to our app using module.exports
module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    // used to deserialize the user
    passport.deserializeUser(function(user, done) {
        done(null, user);
    });

    passport.use(new LocalStrategy(
        function(username, password, done){

            authUser.findOne({username:username}, function(err,user){
                if(user.validPassword(password))
                {
                    return done(null, user);
                }
                return done(null, false, {message: 'unable to login'});
            });
        }
    ));
/*
    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        authUser.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done) {

        console.log('reached local-signup1');
        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {
            console.log('reached local-signup2');
        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        authUser.findOne({ 'username' :  username }, function(err, user) {
            // if there are any errors, return the error
            if (err){
                console.log(err);
                return done(err);
            }
                

            // check to see if theres already a user with that email
            if (user) {
                console.log('That username is already taken!');
                return done(null, false, req.flash('signupMessage', 'That username is already taken!'));
            } else {

                // if there is no user with that email
                // create the user
                User.findOne([{'p_token': req.body.token},{'p_email': req.body.email}], function(err,p_user){
                    if (err){
                        console.log(err);
                        return done(err);
                    }
                    if(p_user){
                        console.log('User with similar details already exists!');
                        var newUser            = new authUser();

                        // set the user's local credentials
                        newUser.username    = username;
                        newUser.password = newUser.generateHash(password);
                        newUser.role = 'CW';
        
                        // save the user
                        newUser.save(function(err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        });
                    } else{
                        console.log('No matching token found');
                        return done(null, false, req.flash('signupMessage', 'Token not found'));
                    }
                });
            }

        });    

        });

    }));

    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done) { // callback with email and password from our form

        console.log('reached local-login1');
        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        authUser.findOne({ 'username' :  username }, function(err, user) {
            // if there are any errors, return the error before anything else
            console.log('local-login2');
            if (err)
                return done(err);

            // if no user is found, return the message
            if (!user){
                console.log('no user found');
                return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
            }
                

            // if the user is found but the password is wrong
            if (!user.validPassword(password)){
                console.log('wrong password');
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
            }

            // all is well, return successful user
            return done(null, user);
        });

    }));
*/

};