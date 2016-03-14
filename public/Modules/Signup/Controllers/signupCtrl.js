var app = angular.module('DiabetikApp');

app.controller("signupCtrl", function($location, $scope, $http, $rootScope){
	$scope.warningAlert = "Some content";
    $scope.showWarningAlert = false;

    // switch flag
    $scope.switchBool = function (value) {
        $scope[value] = !$scope[value];
    };

	$scope.signup = function(user){
		console.log(user);
		$scope.showWarningAlert = false;
		if(user.password1==user.password2){

			$http.post('/signup', user).
			success(function(response, status, config){
				console.log(user);
				$rootScope.currentUser = user;
				$location.url("/home");
			}).error(function(response, status, config){
				console.log('reached error part');
				console.log(response.signupMessage);
				$scope.warningAlert = response.signupMessage;
				$scope.showWarningAlert = true;
			});
		}

	/*	if(user.password1==user.password2){
			$http.post('/signup', user)
			.success(function(user){
				console.log(user);
				$rootScope.currentUser = user;
				$location.url("/home");
			}).error(function(response, status, headers, config){
                $scope.error_message = response.error_message;
            });; 
		}
	*/	
	} 
});

//DIRECTIVE to validate unique username's
/*    app.directive('usernameValidator', function($http, $q) {

    return {
        require: 'ngModel',
        link: function(scope, element, attrs, ngModel) {
            ngModel.$asyncValidators.username = function(username) {
                console.log('modelValue %s', username);
                var url = '/uniqueUsernameCheck/' + username;
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
*/