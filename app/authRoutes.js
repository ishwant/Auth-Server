// app/authRoutes.js
module.exports = function(app, passport) {

    var authUser    = require('../app/models/authUser.js');
    var User        = require('../app/models/case_worker.js');

    app.post("/login", passport.authenticate('local'), function(req,res){
        console.log("/login");
        console.log(req.body);
        res.json(req.user);
    });

    app.post("/signup", function(req,res){

        authUser.findOne({username:req.body.username},function(err,user){
            if(user){
                res.send(200);
                console.log("username taken");
            }
            else{
                console.log('req.body.token: %s', req.body.token);
                console.log('req.body.email: %s', req.body.email);
                User.findOne({'c_token': req.body.token,'c_email': req.body.email}, function(err,c_user){
                    if(c_user){
                        console.log('User with similar details already exists!');
                        var newUser = new authUser();

                        // set the user's local credentials
                        newUser.username    = req.body.username;
                        newUser.password = newUser.generateHash(req.body.password1);
                        newUser.role = 'CW';
                        newUser.unique_ID = c_user.c_id;
                        newUser.first_name = c_user.c_first_name;
                        newUser.last_name = c_user.c_last_name;
        
                        // save the user
                        newUser.save(function(err, user) {
                            if (err)
                                res.send(err);
                            req.login(user,function(err){
                                if(err){ return next(err);}
                                res.json(user);
                            });
                        });
                    }
                    else{
                        console.log('No matching token found');
                        return send({signupMessage: 'Token not found'});
                    }
                });
            }
        });
    });

    app.get("/loggedin", function(req,res){
        res.send(req.isAuthenticated() ? req.user : '0');
    });

    app.post("/logout", function(req,res){
        req.logout();
        res.send(200);
    });
};

