var app = angular.module('DiabetikApp');

app.controller("loginCtrl", function($scope, $http, $rootScope){
	$scope.login = function(user){
		console.log(user);

		$http.post('/login', user)
		.success(function(response){
			console.log(response);
			$rootScope.currentUser = response;
		}); 
	} 
});