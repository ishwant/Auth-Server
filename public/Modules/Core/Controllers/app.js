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
			controller: 'allPatientsCtrl'
		})	
		.when('/registerPatient', {
			templateUrl: 'Modules/Patients/Views/registerPatient.html',
			controller: 'singlePatientCtrl',
			resolve: {
				logincheck: checkLoggedin
			}
		})
		.when('/registrationDetails/:p_id', {
			templateUrl: 'Modules/Patients/Views/registrationDetails.html',
			controller: 'singlePatientCtrl'
		})
		.when('/viewPatient/:p_id', {
			templateUrl: 'Modules/Patients/Views/viewPatient.html',
			controller: 'singlePatientCtrl'
		})
		.when('/editPatient/:p_id', {
			templateUrl: 'Modules/Patients/Views/editPatient.html',
			controller: 'singlePatientCtrl'
		})

		//CASE WORKERS
		.when('/CaseWorkers', {
			templateUrl: 'Modules/Case Workers/Views/c_home.html',
			controller: 'allCaseWorkersCtrl'
		})
		.when('/registerCaseWorker', {
			templateUrl: 'Modules/Case Workers/Views/registerCaseWorker.html',
			controller: 'singleCaseWorkerCtrl'
		})
		.when('/CaseWorkerRegistrationDetails/:c_id', {
			templateUrl: 'Modules/Case Workers/Views/c_registrationDetails.html',
			controller: 'singleCaseWorkerCtrl'
		})
		.when('/viewCaseWorker/:c_id', {
			templateUrl: 'Modules/Case Workers/Views/viewCaseWorker.html',
			controller: 'singleCaseWorkerCtrl'
		})
		.when('/editCaseWorker/:c_id', {
			templateUrl: 'Modules/Case Workers/Views/editCaseWorker.html',
			controller: 'singleCaseWorkerCtrl'
		})

		.when('/viewPatientMessages/:p_id', {
			templateUrl: 'Modules/Patients/Views/messages.html',
			controller: 'singlePatientCtrl'
		})
		.when('/viewPatientReport/:p_id', {
			templateUrl: 'Modules/Patients/Views/report.html',
			controller: 'singlePatientCtrl'
		})
		.otherwise({
			redirectTo: '/'
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
}
