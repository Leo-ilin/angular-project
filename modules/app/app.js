angular
	.module('app', ['core'])
	.controller('navbarController', [
		'$scope', '$rootScope', 'authService', 'AUTH_EVENTS',
		function navbarController($scope, $rootScope, authService, AUTH_EVENTS) {
			$scope.isAuthenticated = authService.isAuthenticated();
			$scope.userLogout = function(){
				return authService.logout().then(
					function(){
						$rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
						$scope.isAuthenticated = false;
					}
				)
			}

			$rootScope.$on(AUTH_EVENTS.loginSuccess, function(e){
				$scope.isAuthenticated = true
			})
		}
	])