// app/authRoutes.js
module.exports = function(app, passport) {

    var authUser    = require('../app/models/authUser.js');
    var User        = require('../app/models/case_worker.js');

    app.post("/login", passport.authenticate('local'), function(req,res){
    //    console.log("/login");
        console.log(req.body);
        res.json(req.user);
    });

    app.post("/signup", function(req,res){

        authUser.findOne({username:req.body.username},function(err,user){
            if(user){
                res.status(500).send({signupMessage: 'Username already exists'});
            //    res.send(200);
                console.log("username taken");
            }
            else{
                console.log('req.body.token: %s', req.body.token);
                User.findOne({
                    'c_token': req.body.token.toLowerCase(),
                    'c_first_name': req.body.fname.toLowerCase()}, 
                    function(err,c_user){
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
                        res.status(500).send({signupMessage: 'No such token found.'});
                        console.log('No matching token found');
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

    app.get('/uniqueUsernameCheck/:username',function(req, res) {
        //console.log(req.params);
        var usernametoTest = req.params.username;
        console.log(usernametoTest);
        authUser.findOne({username: usernametoTest}, function(err,found){
            if(err){
                console.log('username Exists');
                res.send({valid_id:false});
            }
            if(found==null){
                console.log('No such username exists');
                res.send({valid_id:true});
            } else{
                console.log('username Exists');
                res.send({valid_id:false});
            };
            
        });
    }); 
};

