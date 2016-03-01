var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var authUserSchema = mongoose.Schema({
		unique_ID	 : String,
        username     : String, 
        password     : String,
        role         : String,
        first_name	 : String,
        last_name	 : String
});

// methods ======================
// generating a hash
authUserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
authUserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('authUser', authUserSchema);
