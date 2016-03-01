'use strict';

/**
 * @ngdoc overview
 * @name navigation
 * @description
 * # controller for the navigation bar
 *
 */
 
// wrapping your javascript in closure is a good habit
(function(){

var app = angular.module('DiabetikApp');

	app.controller("NavCtrl", function($rootScope, $scope, $http, $location) {
	  	$scope.logout = function() {
	   		$http.post("/logout")
	     		.success(function() {
	       		$rootScope.currentUser = null;
	       		$location.url("/");
	     		});
	  	};
	   	$scope.isActive = function (viewLocation) { 
	       	var active = (viewLocation === $location.path());
     		return active;
	   	};
	});	
})();
