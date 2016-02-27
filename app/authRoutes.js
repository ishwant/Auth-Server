// app/authRoutes.js
module.exports = function(app, passport) {

    var authUser    = require('../app/models/authUser.js');
    var User        = require('../app/models/user.js');

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
                User.findOne([{'p_token': req.body.token},{'p_email': req.body.email}], function(err,p_user){
                    if(p_user){
                        console.log('User with similar details already exists!');
                        var newUser = new authUser();

                        // set the user's local credentials
                        newUser.username    = req.body.username;
                        newUser.password = newUser.generateHash(req.body.password1);
                        newUser.role = 'CW';
        
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
        req.logOut();
        res.send(200);
    });
};

