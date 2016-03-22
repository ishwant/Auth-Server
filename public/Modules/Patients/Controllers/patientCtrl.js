'use strict';

/**
 * @ngdoc overview
 * @name Diabetik App
 * @description
 * # Patient System
 *
 * Main module of the application.
 */
(function(){

    var app = angular.module('DiabetikApp');

    //====================CONTROLLER FOR PATIENT RECORD PAGE===============
    app.controller('allPatientsCtrl', [
        '$scope', 
        '$http', 
        '$rootScope',
        function($scope, $http, $rootScope) {

            $scope.getAllPatients = function() {

                var url = '/patients/';
                console.log('hello');
                
                $http.get(url).success(function(data) {
                    console.log(data);
                    var countUnreadMessages;
                    $scope.users = data;
                    console.log($rootScope.currentUser);
                    // for(var i=0;i<data.p_event_entries.length;i++){

                    // }
                });
            };  
            $scope.sort = function(keyname){
                $scope.sortKey = keyname;   //set the sortKey to the param passed
                $scope.reverse = !$scope.reverse; //if true make it false and vice versa
            };
            $scope.sort1 = function(keyname){
                $scope.sortKey1 = keyname;   //set the sortKey to the param passed
                $scope.reverse1 = !$scope.reverse1; //if true make it false and vice versa
            };
        }
    ]);

    //======CONTROLLER FOR REGISTER PATIENT PAGE=========

    //DIRECTIVE to validate unique patient id's
    app.directive('idValidator', function($http, $q) {

    return {
        require: 'ngModel',
        link: function(scope, element, attrs, ngModel) {
            ngModel.$asyncValidators.id = function(test_id) {
                console.log('modelValue %s', test_id);
                var url = '/uniqueIdCheck/' + test_id;
                console.log('url %s', url);
                return $http.get(url).then(
                    function(response) {
                        if (!response.data.valid_id) {
                            return $q.reject(response.data.errorMessage);
                        }
                        return true;
                    }
                );
            };
        }
    };

    });
    app.directive('toggle', function(){
        return {
        restrict: 'A',
        link: function(scope, element){
            $(element).popover();
        }
        };
    });
    app.directive("checkboxGroup", function() {
        return {
            restrict: "A",
            link: function(scope, elem, attrs) {
                // Determine initial checked boxes
                if (scope.array.indexOf(scope.program.programAlias) !== -1) {
                    elem[0].checked = true;
                }

                // Update array on click
                elem.bind('click', function() {
                    var index = scope.array.indexOf(scope.program.programAlias);
                    // Add if checked
                    if (elem[0].checked) {
                        if (index === -1) scope.array.push(scope.program.programAlias);
                    }
                    // Remove if unchecked
                    else {
                        if (index !== -1) scope.array.splice(index, 1);
                    }
                    // Sort and update DOM display
                    scope.$apply(scope.array.sort(function(a, b) {
                        return a - b
                    }));
                });
            }
        }
    });

    //CONTROLLER
    app.controller('singlePatientCtrl',[
        '$scope',
        '$rootScope', 
        '$http',
        '$location', 
        '$routeParams',
        '$modal',
        function ($scope, $rootScope, $http, $location, $routeParams,$modal) {

            $scope.array = [];
            $scope.array_ = angular.copy($scope.array);

            // $scope.update = function() {
            //     if ($scope.array.toString() !== $scope.array_.toString()) {
            //         return "Changed";
            //     } else {
            //         return "Not Changed";
            //     }
            // };
            $scope.sort = function(keyname){
                $scope.sortKey = keyname;   //set the sortKey to the param passed
                $scope.reverse = !$scope.reverse; //if true make it false and vice versa
            };
            $scope.sort1 = function(keyname){
                $scope.sortKey1 = keyname;   //set the sortKey to the param passed
                $scope.reverse1 = !$scope.reverse1; //if true make it false and vice versa
            };
        
            //=======REGISTER A PATIENT===================
            $scope.addPatient = function(patient,isValid){
                var url = '/registerPatient/';
                console.log(isValid);

                if(isValid){
                    $scope.patient.p_program = $scope.array;
                    console.log(patient);
                    $http.post(url, patient).success(function(response, status, headers, config){
                        console.log('success');
                        if(response.message=='New Patient Registered'){
                            console.log('rootScope patient assigned');
                            $rootScope.p_id = patient.p_id;
                            var p_id = patient.p_id;
                            var newPath = '/registrationDetails/'+ p_id;
                            $location.path(newPath);
                        }
                    }).error(function(response, status, headers, config){
                        $scope.error_message = response.error_message;
                    });
                }
            };

            $scope.getUrlParamtoViewPatient = function(){

                $rootScope.p_id = $routeParams.p_id;
                console.log('function ran and rootscope p_id is: %s',$rootScope.p_id);
            };

            //============VIEW A PATIENT=====================
            $scope.viewRegisteredPatient = function(){

                var url = '/viewPatient/'+ $rootScope.p_id;
                $http.get(url).success(function(data) {
                    console.log(data);

                    $scope.patient = data;
                    if(data.p_active==true){
                        $scope.patient.p_status = 'Active';
                    } else{
                        $scope.patient.p_status = 'De-active';
                    }
                    $scope.patient = data;
                    $scope.array = $scope.patient.p_program;
                    console.log($scope.array);
                    $scope.patient.p_dob = new Date(data.p_dob);

                });
            };
            $scope.viewPatient = function(patient){
                
                console.log('object to view: %s', patient.p_token);
                $rootScope.p_id = patient.p_id;
                var url = '/viewPatient/'+ patient.p_id;
                $location.path(url);
                console.log('location changed');
            };

            //============EDIT A PATIENT=======================
            $scope.editPatientRoute = function(patient){

                console.log('EDIT PATIENT ROUTE PARAM OBJECT NAME %s', patient.p_first_name);
                var url = '/editPatient/'+ patient.p_id;
                $location.path(url);
                console.log('edit location changed');
            };
            $scope.getUrlParamtoEditPatient = function(){

                $rootScope.p_id = $routeParams.p_id;
                console.log('EditPatient function ran and rootscope id is: %s',$rootScope.p_id);
            };
            $scope.editPatient = function(patient, isValid){

                var url = '/editPatient/'+patient.p_id;
                console.log('editPatient function called');
                console.log(patient);
                console.log(isValid);
                console.log(patient.p_program);

                if(isValid){
                    console.log(patient);
                    patient.p_program = $scope.array;
                    $http.put(url, patient).success(function(response, status, headers, config){
                        console.log('success');
                        if(response.message=='Patient updated'){
                            $scope.alert = {   
                                msg:  'Patient profile updated successfully!!' 
                            };
                            alert("Patient profile updated");
                            var url2='/viewPatient/'+patient.p_id;
                            $location.path(url2);
                        }
                    }).error(function(response, status, headers, config){
                        $scope.error_message = response.error_message;
                    });
                }
            };

            $scope.generateToken = function (){
                console.log('generateToken called');

                var tokenLenth = 6;

                var characters = ['a', 'b', 'c', 'g',  'l', 'o', 't', '2', 'd', 'u'];
                var numbers = ['2','3'];

                var finalCharacters = characters;
                finalCharacters = finalCharacters.concat(numbers);


                var tokenArray = [];
                for (var i = 0; i < tokenLenth; i++) {
                    tokenArray.push(finalCharacters[Math.floor(Math.random() * finalCharacters.length)]);
                };
                var token = tokenArray.join("");

                $scope.patient.p_token = token;
                console.log('token in generateToken %s', token);
                return token;   
            };
            //============DEACTIVATE A PATIENT=======================
            $scope.togglePatientStatus = function(patient){
                var url = '/togglePatientStatus/'+patient.p_id;
                console.log('deactivatePatient called');

                $http.put(url).success(function(response, status, headers, config){
                        console.log('success');
                        if(response.message=='Patient profile status changed'){
                            if(patient.p_status=='Active'){
                                alert("Patient profile Deactivated!");
                            }
                            else{
                                alert("Patient profile Activated!");
                            }                               
                            var url2='/home';
                            $location.path(url2);
                        }
                    }).error(function(response, status, headers, config){
                        $scope.error_message = response.error_message;
                    });
            };

            //=============VIEW MESSAGES=============================
            $scope.viewPatientMessages = function(patient){
                
            //    console.log('object to view messages: %s', patient.p_token);
                $rootScope.p_id = patient.p_id;
                $rootScope.patient = patient;
                var url = '/viewPatientMessages/'+ patient.p_id;
                $location.path(url);
                console.log('location changed');
            };
            $scope.viewlistofPatientMessages = function(){

                var url = '/viewPatient/'+ $rootScope.p_id;
                $http.get(url).success(function(data) {
                    console.log(data);
                    $scope.p_messages = data.p_messages;
                    $scope.p_first_name = data.p_first_name;
                    $scope.p_last_name = data.p_last_name;
                    $scope.p_dob = data.p_dob;
                    $scope.p_program = data.p_program; 
                    $scope.p_messageread = data.p_messageread; 
                    console.log($scope.p_messageread);
                });
            };
            $scope.readMessage = function(message){

                var url = '/messageRead/'+ $rootScope.p_id+ '/'+ message._id + '/' + message.read;
                $http.put(url).success(function(response, status, headers, config){
                    console.log('success');
                    if(response.message=='msg status toggled'){
                        $scope.viewlistofPatientMessages();
                    }
                }).error(function(response, status, headers, config){
                    $scope.error_message = response.error_message;
                });
            };
            $scope.readEntry = function(entry){
                var url = '/entryRead/'+ $rootScope.p_id+ '/'+ entry._id +'/'+ entry.read;
                $http.put(url).success(function(response, status, headers, config){
                    console.log('success');
                    if(response.message=='entry read'){
                        $scope.viewlistofPatientEntries();
                    }
                }).error(function(response, status, headers, config){
                    $scope.error_message = response.error_message;
                });
            };
        /*    $scope.deleteMessage = function(message){

                var url = '/deleteMessage/'+ $rootScope.p_id + '/' + message.m_id;
                console.log(url);
                $http.delete(url).success(function(response, status, headers, config){
                    console.log(response.message);
                //    window.location.reload();
                    $scope.viewlistofPatientMessages();
                }).error(function(response, status, headers, config){
                    $scope.error_message = response.error_message; 
                    console.log(response.error_message);     
                });
            };
        */
            //============VIEW REPORTS=============================
            $scope.viewPatientReport = function(patient){
                $rootScope.p_id = patient.p_id;
                $rootScope.patient = patient;
                var url = '/viewPatientReport/'+ patient.p_id;
                $location.path(url);
                console.log('location changed');
            };
            $scope.viewlistofPatientEntries = function(){

                var url = '/viewPatientReport/'+ $rootScope.p_id;
                $http.get(url).success(function(data) {
                    console.log(data);
                    $scope.receive = data;
                /*    for(var i = 0; i < $scope.receive.p_event_entries.length; i++) {
                        console.log("temp %s", $scope.receive.p_event_entries[i]);
                    //    var dec = $crypto.decrypt( $scope.receive.p_event_entries[i].event_name, $scope.receive.p_token);
                    //    console.log("dec %s", dec);
                    }
                */
                    $scope.p_first_name = data.p_first_name;
                    $scope.p_last_name = data.p_last_name;
                    $rootScope.p_first_name = data.p_first_name;
                    $rootScope.p_last_name = data.p_last_name;
                    $scope.p_dob = data.p_dob;
                    $scope.p_program = data.p_program; 
                    $scope.p_event_entries = data.p_event_entries;
                    console.log($scope.p_event_entries);

                
                });
            };
            $scope.open = function (entries) {
                $rootScope.entries = entries;
                console.log($rootScope.entries);
                $modal.open({
                    templateUrl: 'Modules/Patients/Views/pdfModal.html',
                });
            };
            $scope.generatePdf= function(sdate, edate){
                console.log("hello");
                console.log("sdate %s", sdate);
                console.log("edate %s", edate);
                console.log("entries %s", $rootScope.entries);
                var entries = $rootScope.entries;
                var start = new Date(sdate);
                var end = new Date(edate);
                var rows =[];
                for(var i=0;i<entries.length;i++){
                    console.log(entries[i].event_timestamp);
                    var eventDate = new Date(entries[i].event_timestamp);
                    if((eventDate<=end)&&(eventDate>=start)){
                        console.log("Entering");
                        $scope.temp =[];
                    $scope.temp.date = entries[i].event_timestamp;
                    $scope.temp.category = entries[i].category;
                    $scope.temp.info = entries[i].event_name;
                    if(entries[i].event_notes==null){
                        $scope.temp.notes = " ";
                    }
                    else{
                        $scope.temp.notes = entries[i].event_notes;
                    }
                    $scope.temp.details = entries[i].event_details;
                    $scope.temp.message = entries[i].message;
                    if(entries[i].category=="Medication"){
                        $scope.temp.amount = entries[i].medicine_amount + ' '+
                                      entries[i].medicine_type ;
                    }
                    else if(entries[i].category=="Activity"){
                        $scope.temp.amount = entries[i].activity_time +
                                      ' minutes' ;
                    }
                    else if(entries[i].category=="Food"){
                        $scope.temp.amount = entries[i].meal_amount +
                                      ' calories' ;
                    }
                    else if(entries[i].category=="Reading"){
                        $scope.temp.amount = entries[i].reading_value +
                                      ' mg/dL' ;
                    }
                    else if(entries[i].category=="Note"){
                        $scope.temp.amount = entries[i].event_notes;
                    }
                    rows.push($scope.temp); 
                    }
                                       
                }
                var columns = [
                    {title: "Date", dataKey: "date"},
                    {title: "Type", dataKey: "category"}, 
                    {title: "Info", dataKey: "info"}, 
                    {title: "Amount", dataKey: "amount"}, 
                    {title: "Notes", dataKey: "notes"},
                    {title: "Details", dataKey: "details"},
                    {title: "Message", dataKey: "message"}, 
                ];
                var head = "Patient Report : " + $rootScope.p_first_name+" "+$rootScope.p_last_name+" (ID = "+$rootScope.p_id+")";
                // Only pt supported (not mm or in)
                var doc = new jsPDF('p', 'pt');
                doc.autoTable(columns, rows, {
                    margin: {top: 60},
                    beforePageContent: function(data) {
                        doc.text(head, 40, 30);
                    }
                });
                var filename = $scope.p_first_name+" "+$scope.p_last_name+" (ID = "+$scope.p_id+").pdf";
                doc.save(filename);
            




            //     console.log(entries);
            //     var doc = new jsPDF();
            //     doc.setFontSize(40);
            //     doc.text(65, 35, "Patient Report");

            //     doc.setFontSize(12);
                
            //     var category = $rootScope.p_id;
            //     console.log(category);
            //     var y = 45;
            //     var x = 12;
            //     for(var i=0;i<entries.length;i++){
            //       //  doc.text(12,45,)
            //       //  var entry = entries[i].event_timestamp
            //     }
            // //    doc.text(20,30,category);
            // //    doc.text(20, 30, 'This is client-side Javascript, pumping out a PDF.');
            // //    doc.addPage();
            //  //   doc.text(20, 20, 'Do you like that?');
                
            //     doc.save('Test.pdf'); 


            }        
        }
    ]);
})();










