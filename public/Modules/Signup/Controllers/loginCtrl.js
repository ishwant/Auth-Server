var app = angular.module('DiabetikApp');

app.controller("loginCtrl", function($scope, $http, $rootScope, $location){
	$scope.warningAlert = "Some content";
    $scope.showWarningAlert = false;

    // switch flag
    $scope.switchBool = function (value) {
        $scope[value] = !$scope[value];
    };	

	$scope.login = function(user){

		console.log(user);
		$scope.showWarningAlert = false;
		$http.post('/login', user)
		.success(function(response){
			console.log(response);
			$rootScope.currentUser = response;
			$location.url("/home");
		}).error(function(response, status, config){
			console.log('reached error part');
			if(response=="Unauthorized"){
				$scope.warningAlert = 'Incorrect Username/Password';
				$scope.showWarningAlert = true;
			}
		}); 
	} 
});