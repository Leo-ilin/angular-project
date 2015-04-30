angular
	.module('app', ['core'])
	.controller('NavbarController', [
		'$scope', '$rootScope', 'authService', 'AUTH_EVENTS',
		function NavbarController($scope, $rootScope, authService, AUTH_EVENTS) {
			$scope.isAuthenticated = authService.isAuthenticated();
			$scope.userLogout = function(){
				return authService.logout().then(
					function(){
						$scope.isAuthenticated = false;
					}
				)
			}

			var offLoginEvent = $scope.$on(AUTH_EVENTS.loginSuccess, function(e){
				$scope.isAuthenticated = true
			})

			$scope.$on('$destroy', offLoginEvent);
		}
	])