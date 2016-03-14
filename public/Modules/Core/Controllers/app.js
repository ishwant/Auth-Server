'use strict'; // <-- what does this mean?

/**
 * @ngdoc overview
 * @name budgy
 * @description
 * # envelope system
 *
 * Main module of the application.
 */
 
// wrapping your javascript in closure is a good habit
(function(){

	var app = angular.module('DiabetikApp', 
		['ngAnimate',
		'ngAria',
		'ngCookies',
		'ngMessages',
		'ngResource',
		'ngRoute',
		'ngSanitize',
		
		'ngCsv',

		'ngTouch',
		'ui.bootstrap',
		'angularUtils.directives.dirPagination'])

	app.config(function ($routeProvider) {
		$routeProvider

		.when('/', {
			templateUrl: 'Modules/Signup/Views/landing.html',
		})
		.when('/login', {
			templateUrl: 'Modules/Signup/Views/login.html',
			controller: 'loginCtrl'
		})
		.when('/signup', {
			templateUrl: 'Modules/Signup/Views/signup.html',
			controller: 'signupCtrl'
		})

		//PATIENTS
		.when('/home', {
			templateUrl: 'Modules/Patients/Views/home.html',
			controller: 'allPatientsCtrl',
			resolve: {
				logincheck: checkLoggedin
			}
		})	
		.when('/registerPatient', {
			templateUrl: 'Modules/Patients/Views/registerPatient.html',
			controller: 'singlePatientCtrl',
			resolve: {
				logincheck: checkAdmin,
				logincheck2: checkLoggedin
			}
		})
		.when('/registrationDetails/:p_id', {
			templateUrl: 'Modules/Patients/Views/registrationDetails.html',
			controller: 'singlePatientCtrl',
			resolve: {
				logincheck: checkAdmin,
				logincheck2: checkLoggedin
			}
		})
		.when('/viewPatient/:p_id', {
			templateUrl: 'Modules/Patients/Views/viewPatient.html',
			controller: 'singlePatientCtrl',
			resolve: {
				logincheck: checkLoggedin
			}
		})
		.when('/editPatient/:p_id', {
			templateUrl: 'Modules/Patients/Views/editPatient.html',
			controller: 'singlePatientCtrl',
			resolve: {
				logincheck: checkLoggedin
			}
		})

		//CASE WORKERS
		.when('/CaseWorkers', {
			templateUrl: 'Modules/Case Workers/Views/c_home.html',
			controller: 'allCaseWorkersCtrl',
			resolve: {
				logincheck: checkAdmin,
				logincheck2: checkLoggedin
			}
		})
		.when('/registerCaseWorker', {
			templateUrl: 'Modules/Case Workers/Views/registerCaseWorker.html',
			controller: 'singleCaseWorkerCtrl',
			resolve: {
				logincheck: checkAdmin,
				logincheck2: checkLoggedin
			}
		})
		.when('/CaseWorkerRegistrationDetails/:c_id', {
			templateUrl: 'Modules/Case Workers/Views/c_registrationDetails.html',
			controller: 'singleCaseWorkerCtrl',
			resolve: {
				logincheck: checkAdmin,
				logincheck2: checkLoggedin
			}
		})
		.when('/viewCaseWorker/:c_id', {
			templateUrl: 'Modules/Case Workers/Views/viewCaseWorker.html',
			controller: 'singleCaseWorkerCtrl',
			resolve: {
				logincheck: checkAdmin,
				logincheck2: checkLoggedin
			}
		})
		.when('/editCaseWorker/:c_id', {
			templateUrl: 'Modules/Case Workers/Views/editCaseWorker.html',
			controller: 'singleCaseWorkerCtrl',
			resolve: {
				logincheck: checkAdmin,
				logincheck2: checkLoggedin
			}
		})

		.when('/viewPatientMessages/:p_id', {
			templateUrl: 'Modules/Patients/Views/messages.html',
			controller: 'singlePatientCtrl',
			resolve: {
				logincheck: checkLoggedin
			}
		})
		.when('/viewPatientReport/:p_id', {
			templateUrl: 'Modules/Patients/Views/report.html',
			controller: 'singlePatientCtrl',
			resolve: {
				logincheck: checkLoggedin
			}
		})
		//programs
		.when('/programs', {
			templateUrl: 'Modules/Programs/Views/programs.html',
			controller: 'programCtrl',
			resolve: {
				logincheck: checkAdmin
			}
		})
		//Admins
		.when('/admins', {
			templateUrl: 'Modules/Case Workers/Views/admins.html',
			controller: 'singleCaseWorkerCtrl',
			resolve: {
				logincheck: checkAdmin
			}
		})
		.otherwise({
			redirectTo: '/home'
		});
	})

})();

var checkLoggedin = function($q, $timeout, $http, $location, $rootScope) {
  var deferred = $q.defer();

  $http.get('/loggedin').success(function(user) {
    $rootScope.errorMessage = null;
    //User is Authenticated
    if (user !== '0') {
      $rootScope.currentUser = user;
      deferred.resolve();
    } else { //User is not Authenticated
      $rootScope.errorMessage = 'You need to log in.';
      deferred.reject();
      $location.url('/login');
    }
  });
  return deferred.promise;
};

var checkAdmin = function($q, $timeout, $http, $location, $rootScope) {
  var deferred = $q.defer();

  $http.get('/loggedin').success(function(user) {
    $rootScope.errorMessage = null;
    //User is Authenticated
    if (user !== '0') {
    	if(user.role=='admin'||user.role =='super'){
    		$rootScope.currentUser = user;
      		deferred.resolve();
    	}    
    	else{
    		$location.url('/home');
    	}  
    } else { //User is not Authenticated
      $rootScope.errorMessage = 'You need to log in.';
      deferred.reject();
      $location.url('/login');
    }
  });
  return deferred.promise;
};
