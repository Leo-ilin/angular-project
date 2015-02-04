angular
	.module('core', [
		'ngAnimate',
		'cfp.loadingBar',//loading bar without interceptor
		//'angular-loading-bar', // with interceptor
		'oc.lazyLoad',
		'ui.router',
		'common.services'
	])
	.constant('DEBUG', App.DEBUG)
	.config(['$httpProvider', function($httpProvider) {
		$httpProvider.interceptors.push('authInterceptor');
	}])
	.run([
		'$rootScope', 'authService', '$state', 'AUTH_EVENTS',
		function authHandler($rootScope, authService, $state, AUTH_EVENTS){
			authService.init();

			$rootScope.$on(AUTH_EVENTS.notAuthenticated, function(e){
				$state.go('user.login');
			})
			$rootScope.$on(AUTH_EVENTS.loginSuccess, function(e){
				var lastState = authService.getReturnState();
				if(lastState){
					$state.go(lastState.name, lastState.params)
				} else {
					$state.go('index', {})
				}
			})
			$rootScope.$on(AUTH_EVENTS.logoutSuccess, function(e){
				$state.go('user.login');
			})
			$rootScope.$on(AUTH_EVENTS.notAuthorized, function(e){
				//Use this exception when a user has been authenticated but is not allowed to perform the requested action
			})
		}
	])
	.run([
		'$rootScope', 'cfpLoadingBar',
		function loadingBarHandler($rootScope, cfpLoadingBar) {

			var start = cfpLoadingBar.start;
			var complete = cfpLoadingBar.complete;

			$rootScope.$on('$stateChangeStart', start)
			$rootScope.$on('$stateChangeSuccess', complete)
			$rootScope.$on('$stateChangeError', complete)
		}
	])