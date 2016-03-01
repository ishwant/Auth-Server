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

    app.controller('programCtrl', [
        '$scope', 
        '$http',
        '$rootScope', 
        function($scope, $http, $rootScope) {

            $scope.getAllPrograms = function() {

                var url = '/programs';
                console.log('hello');
                
                $http.get(url).success(function(data) {
                    console.log(data);
                //    $scope.programs = data;
                    $rootScope.programs = data;
                });
            };  
            $scope.addNewProgram = function(program) {

                var url = '/programs';
                console.log(program);
                $scope.go = false;
                if(program){
                    $scope.go = true;
                }
                if($scope.go){

                    $http.post(url, program).success(function(data){
                        console.log('success');
                        $scope.program={};
                        $rootScope.programs = data;
                    });
                }    
            }; 
            $scope.deleteProgram = function(program) {

                var url = '/program/'+program._id;
                console.log('id: %s', program._id);
                $http.delete(url, program).success(function(response, status, headers, config){
                    console.log('success');
                    $rootScope.programs = response;
                }).error(function(response, status, headers, config){
                    $scope.error_message = response.error_message;      
                });
            /*    $http.delete(url, program).success(function(data){
                    console.log('success');
                    $rootScope.programs = data;
                }); 
            */
            }; 

        }
    ]); 
    
})();