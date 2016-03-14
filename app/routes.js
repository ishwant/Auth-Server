module.exports = function(app) {

	// server routes ===========================================================

	var User            = require('./models/user.js');

	//User registration API

	app.post('/appsignup', function(req, res) { //I

		console.log('User FName: %s',req.body.userFName);
		console.log('User LName: %s',req.body.userLName);
		console.log('User Token: %s',req.body.userToken);

   		var req_fname = req.body.userFName;
   		var req_lname = req.body.userLName;
   		var req_token = req.body.userToken;

         var decryptedtoken = decipher(req_token, req_fname);
         console.log('deciphered token: %s', decryptedtoken);

   		User.findOne({ p_token : decryptedtoken},   function(err,founduser){
   			console.log('query ran');
            if(err){
               res.send({status: 'FAIL', message : err});
            }
   			if(founduser == null){
   				console.log("Error found");
   				res.send({ status : 'FAIL' , message : 'Token not found' });	
   			} else {
   				console.log(founduser.toString());
   				if(founduser.p_first_name != req_fname || founduser.p_last_name != req_lname){
   					console.log("Incorrect username");
   					res.send({ status : 'FAIL' , message : 'User Incorrect'});
   				}
   				else{
   					res.send({ status : 'SUCCESS' , message : 'Sign-up'});
   				}				
   			}
   		});
	}); 
   app.post('/share', function(req, res) { //I

      var entryToPost = {
         shared_date :  new Date(),
         category :  req.body.eventCategory,
         event_name :  req.body.eventName,
         event_notes:   req.body.eventNotes,
         event_timestamp:   req.body.eventTimestamp,
         medicine_amount:  req.body.eventMedicineAmount,
         medicine_type:   req.body.eventMedicineType,
         meal_amount :  req.body.eventMealAmount,
         reading_value :  req.body.eventReadingValue,
         activity_time :  req.body.eventActivityTime,
         message       : req.body.eventMessage, 
         event_details : req.body.eventDetails,
         read          : false
      };
      console.log(entryToPost);

      // User.findOneAndUpdate({ p_token : req.body.UserToken.toString()},
      // {
      //    "$addToSet" : {
      //          "p_event_entries" : entryToPost
      //    }
      // },
      User.findOneAndUpdate({ p_token : req.body.UserToken.toString()},
      {
         p_eventread : false,
         "$addToSet" : {
            "p_event_entries" : entryToPost
         }
      },
      function(err) {
         if (err)
         {
            res.send({ status : 'FAIL'});
            console.log("FAIL: %s", err);
         }
         res.json({ status: "SUCCESS"});
      }
      ); // end of findOne query 

   }); // end of post function
   app.post('/message', function(req, res) { //I

      var sentMessage = {
         m_share_date :  new Date(),
         m_message    :  req.body.message,
         read         :  false
      };
      console.log(sentMessage);

      // User.findOneAndUpdate({ p_token : req.body.UserToken.toString()},
      // {
      //    "$addToSet" : {
      //          "p_messages" : sentMessage
      //    }
      // },
      User.findOneAndUpdate({ p_token : req.body.UserToken.toString()},
      {
            p_messageread : false,
            "$addToSet" : {
               "p_messages" : sentMessage
            }
      },
      function(err) {
         if (err)
         {
            res.send({ status : 'FAIL'});
            console.log("FAIL: %s", err);
         }
         res.json({ status: "SUCCESS"});
      }
      ); // end of findOne query 

   }); // end of post function

}; //Main function closing
