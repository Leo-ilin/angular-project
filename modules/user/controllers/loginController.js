'use strict';

angular
	.module('user')
	.controller('loginController', [
		'$scope','$rootScope','$state','authService','AUTH_EVENTS',
		function($scope, $rootScope, $state, authService, AUTH_EVENTS) {
			$scope.rememberMe = true;
			$scope.credentials = {};

			$scope.login = function login() {
				authService.login($scope.credentials, $scope.rememberMe).then(
					function(response){
						$rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
					},
					function(error){
						$rootScope.$broadcast(AUTH_EVENTS.loginFailed);
					}
				)
			}
		}
	])