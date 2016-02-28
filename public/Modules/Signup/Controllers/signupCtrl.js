var app = angular.module('DiabetikApp');

app.controller("signupCtrl", function($location, $scope, $http, $rootScope){
	$scope.signup = function(user){
		console.log(user);

		if(user.password1==user.password2){
			$http.post('/signup', user)
			.success(function(user){
				console.log(user);
				$rootScope.currentUser = user;
				$location.url("/home");
			}); 
		}
		
	} 
});