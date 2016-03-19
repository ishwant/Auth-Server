var User            = require('./models/user.js');
var program            = require('./models/program.js');
var cw 				= require('./models/case_worker.js');

module.exports = function(app, passport) {
	

	//===============GET ALL PATIENT RECORDS===========================

	app.get('/patients', auth, function(req, res) {

		if((req.user.role == 'admin')||(req.user.role=='super')){
			User.find(function(err, users) {

				console.log('/patients req.user %s',req.user.username);
				// if there is an error retrieving, send the error. nothing after res.send(err) will execute
				if (err)
					res.send(err);

				res.json(users); // return all todos in JSON format
			});
		}
		else {
			cw.findOne({c_id: req.user.unique_ID}, function(err, cwfound) {
				if(cwfound){
					var caseworker = cwfound.c_first_name+' '+cwfound.c_last_name+' (ID = '+cwfound.c_id+')';
					console.log('caseworker to find: %s', caseworker);
					var cwfind = cwfound.c_id;

					User.find({p_case_worker: caseworker}, function(err, users){
						if (err)
							res.send(err);
						console.log('found cw patient');
						res.json(users); // return all todos in JSON format
					});
				}
			//	res.send(err);
			});
		}
		
	});	

	//================REGISTER NEW PATIENT=============================

	app.post('/registerPatient',auth, function(req, res) {
		var newPatient = new User();

		console.log(req.body.p_case_worker);
		newPatient.p_id = req.body.p_id;
		newPatient.p_first_name = req.body.p_first_name.toLowerCase();
		newPatient.p_last_name = req.body.p_last_name.toLowerCase();
		newPatient.p_dob = req.body.p_dob;
		newPatient.p_mobile_contact = req.body.p_mobile_contact;
		newPatient.p_email = req.body.p_email.toLowerCase();
		newPatient.p_address1 = req.body.p_address1;
		newPatient.p_address2 = req.body.p_address2;
		newPatient.p_city = req.body.p_city;
		newPatient.p_state = req.body.p_state;
		newPatient.p_zipcode = req.body.p_zipcode;
		newPatient.p_case_worker = req.body.p_case_worker.toLowerCase();
		newPatient.p_program = req.body.p_program;
		newPatient.p_active = true;
		newPatient.p_messageread = true;
		newPatient.p_eventread = true;

		var token = generateToken();
		console.log("generated token: %s", token);

		newPatient.p_token = token;
		
		User.findOne({p_id: newPatient.p_id}, function(err,found){
			if(found==null){
				newPatient.save(function(err){
					if(err){
						console.log(err);
						res.send(err);
					}
					res.json({message: 'New Patient Registered'});
				});
			}
		}); 
	});	

	//================VIEW ONE PATIENT RECORD=========================
	app.get('/viewPatient/:p_id',auth, function(req, res) {
		var patient_id = req.params.p_id;
		User.findOne({p_id: patient_id}, function(err,found){
			if(err){
				console.log('error occured');
				res.send(err);
			}
			if(found==null){
				console.log('No such user exists');
				res.send({status: 'User not found'});
			}
			if(found!=null){
				console.log('viewPatient called, User Found!');
				res.send(found);
			};
		});
	});	
	app.get('/viewPatientReport/:p_id',auth, function(req, res) {
		var patient_id = req.params.p_id;
		User.findOne({p_id: patient_id}, function(err,found){
			if(err){
				console.log('error occured');
				res.send(err);
			}
			if(found==null){
				console.log('No such user exists');
				res.send({status: 'User not found'});
			}
			if(found!=null){
				console.log('viewPatient called, User Found!');
				for(var i = 0; i < found.p_event_entries.length; i++) {
					if(found.p_event_entries[i].event_name !=null)
						found.p_event_entries[i].event_name = decipher(found.p_event_entries[i].event_name, found.p_token);
					if(found.p_event_entries[i].category!=null)
						found.p_event_entries[i].category = decipher(found.p_event_entries[i].category, found.p_token);

					if(found.p_event_entries[i].category=="Reading"){
						found.p_event_entries[i].reading_value = decipher(found.p_event_entries[i].reading_value, found.p_token);
					}
					else if(found.p_event_entries[i].category=="Medication"){
						found.p_event_entries[i].medicine_type = decipher(found.p_event_entries[i].medicine_type, found.p_token);
					}

				}
				res.send(found);
			};
		});
	});	


	//================UPDATE PATIENT RECORD=============================

	app.put('/editPatient/:p_id',auth, function(req, res) {
		
		var patient_id = req.params.p_id;
		User.findOne({p_id: patient_id}, function(err,found){
			if(err){
				console.log('error occured');
				res.send(err);
			}
			if(found==null){
				console.log('No such user exists');
				res.send({status: 'User not found'});
			}
			if(found!=null){
				console.log('editPatient called, User Found!');
				found.p_program = [];
				found.p_id = req.body.p_id;
				found.p_first_name = req.body.p_first_name;
				found.p_last_name = req.body.p_last_name;
				found.p_dob = req.body.p_dob;
				found.p_mobile_contact = req.body.p_mobile_contact;
				found.p_email = req.body.p_email;
				found.p_address1 = req.body.p_address1;
				found.p_address2 = req.body.p_address2;
				found.p_city = req.body.p_city;
				found.p_state = req.body.p_state;
				found.p_zipcode = req.body.p_zipcode;
				found.p_case_worker = req.body.p_case_worker;
				found.p_program = req.body.p_program;
				console.log(found.p_program);
				found.p_active = req.body.p_status;
				found.p_token = req.body.p_token;
				found.save(function(err) {
		
					if (err)
					{
						res.send(err);
					}
					res.json({message: "Patient updated"});
				});
			};
		});
	});

	app.put('/entryRead/:p_id/:e_id/:currentStatus',auth, function(req, res) {
		
		var patient_id = req.params.p_id;
		var entry_id = req.params.e_id;
		var currentS = req.params.currentStatus;

		var final;
		if(currentS=="true"){
			final = false;
		}
		else{
			final = true;
		}

		console.log("p_id: %s", patient_id);
		console.log("e_id: %s", entry_id);

		User.update(
			{"p_id": patient_id, "p_event_entries._id": entry_id},
			{
				"$set":{"p_event_entries.$.read":final}
			}, 
			function(err) {
				if (err)
				{ 
					console.log(err);
					res.send(err);
				}
				overAllRead(patient_id);
				console.log("event status toggled");
				res.json({ message: 'entry read' });
			}
		);
		
	});	

	//================DEACTIVATE PATIENT PROFILE=============================

	app.put('/togglePatientStatus/:p_id',auth, function(req, res) {
		
		var patient_id = req.params.p_id;
		User.findOne({p_id: patient_id}, function(err,found){
			if(err){
				console.log('error occured');
				res.send(err);
			}
			if(found!=null){
				console.log('deactivatePatient called, User Found!');
				if(found.p_active==true){
					found.p_active = false;
				} else{
					found.p_active = true;
				}
				found.save(function(err) {
		
					if (err)
					{
						res.send(err);
					}
					res.json({message: "Patient profile status changed"});
				});
			};
		});
	});	


	//================CHECK UNIQUE PATIENT ID=========================

	app.get('/uniqueIdCheck/:test_id',auth, function(req, res) {
		//console.log(req.params);
		var p_idtoTest = req.params.test_id;
		console.log(p_idtoTest);
		User.findOne({p_id: p_idtoTest}, function(err,found){
			if(err){
				console.log('p_id Exists');
				res.send({valid_id:false});
			}
			if(found==null){
				console.log('No such p_id exists');
				res.send({valid_id:true});
			} else{
				console.log('p_id Exists');
				res.send({valid_id:false});
			};
			
		});
	});	

	//================Read A MESSAGE=============================

	app.put('/messageRead/:p_id/:m_id/:currentStatus',auth, function(req, res) {
		
		var patient_id = req.params.p_id;
		var message_id = req.params.m_id;
		var currentS = req.params.currentStatus;
		var final;
		if(currentS=="true"){
			final = false;
		}
		else{
			final = true;
		}
		console.log("p_id: %s", patient_id);
		console.log("m_id: %s", message_id);
		console.log("final: %s", final);
		User.update(
			{"p_id": patient_id, "p_messages._id": message_id},
			{
				//"$set":{"p_messages.$.read":true}
				"$set":{"p_messages.$.read":final}
			}, 
			function(err) {
				if (err)
				{ 
					console.log(err);
					res.send(err);
				}
				overAllRead(patient_id);
				console.log("msg status toggled");
				res.json({ message: 'msg status toggled' });
			}
		);
		
	});	
	var overAllRead = function (p_id){
		var patient_id = p_id;
		console.log("overAllRead called %s",patient_id);
		User.findOne({p_id: patient_id}, function(err,found){
	  		//	console.log("found patient %j",found);
				if(found){
					found.p_messageread = true;
					found.p_eventread = true;
					for (var i = found.p_messages.length - 1; i >= 0; i--) {
						if(!found.p_messages[i].read){
							found.p_messageread = false;
						}
					};
					for (var i = found.p_event_entries.length - 1; i >= 0; i--) {
						if(!found.p_event_entries[i].read){
							found.p_eventread = false;
						}
					};
					found.save();
				}
		   	}
		);
	};


	//============FUNCTION TO GENERATE TOKEN==========================
    var generateToken = function (){
        console.log('generateToken called');
        var tokenLenth = 5;

        var characters = ['a', 'b', 'c', 'g',  'l', 'o', 't'];
        var numbers = ['2','3'];

        var finalCharacters = characters;
        finalCharacters = finalCharacters.concat(numbers);


        var tokenArray = [];
        for (var i = 0; i < tokenLenth; i++) {
            tokenArray.push(finalCharacters[Math.floor(Math.random() * finalCharacters.length)]);
        };
        var token = tokenArray.join("");
        console.log('token in generateToken %s', token);
        return token;   
    };

    //////////////////////////////////////////////////////////////////

    //=============HANDLING PROGRAMS================================

    //GET ALL PROGRAMS
    app.get('/programs',auth, function(req, res) {
    	getprgms(res);		
	});	

    //ADD NEW PROGRAM
    app.post('/programs',auth, function(req, res) {
		var newProgram = new program();
		console.log('printing body %s', req.body);
		newProgram.programName = req.body.name;
		newProgram.programAlias = req.body.alias;
		
		program.findOne({programName: newProgram.programName}, function(err,found){
			if(found==null){
				newProgram.save(function(err){
					if(err){
						console.log(err);
						res.send(err);
					}
					getprgms(res);
					
				});
			}
		});
	});	
	app.delete('/program/:programID',auth, function(req, res) {
		
		console.log('printing body %j', req.body);
		var program_id = req.params.programID;

		program.findByIdAndRemove(program_id, function(err) {
		
			if (err)
			{ 
				console.log(err);
				res.send(err);
			}
			getprgms(res);
		});
	});

};
function getprgms(res){
	program.find(function(err, prgm) {

			// if there is an error retrieving, send the error. nothing after res.send(err) will execute
			if (err)
				res.send(err)

			res.json(prgm); // return all todos in JSON format
		});
}

var auth = function(req, res, next) {
  if (!req.isAuthenticated())
    res.send(401);
  else
    next();
}



