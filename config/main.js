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
			var loginState = 'user.login',
				homeState = 'index';

			authService.init();

			$rootScope.$on(AUTH_EVENTS.notAuthenticated, function(e){
				$state.go(loginState);
			})

			$rootScope.$on(AUTH_EVENTS.notAuthorized, function(e){
				//Use this exception when a user has been authenticated but is not allowed to perform the requested action
			})

			$rootScope.$on(AUTH_EVENTS.logoutSuccess, function(e){
				//on user logout remember current state
				authService.setReturnState($rootScope.$state.current, $rootScope.$state.params)
				$state.go(loginState);
			})

			$rootScope.$on(AUTH_EVENTS.loginSuccess, function(e){
				var lastState = authService.getReturnState();
				if(lastState){
					$state.go(lastState.name, lastState.params)
				} else {
					$state.go(homeState, {})
				}
			})

			$rootScope.$on('$stateChangeStart',
				function(event, toState, toParams, fromState, fromParams){
					//AUTHENTICATION CHECK
					if(toState.authenticate !== false && !authService.isAuthenticated()) {
						//auth required
						if (!fromState.abstract && toState.name.indexOf('user') < 0) {
							//remember not abstract and not user module's states
							authService.setReturnState(fromState, fromParams)
						}
						$state.transitionTo(loginState);
						event.preventDefault();
					}
				})

			$rootScope.$on('$stateChangeSuccess',
				function(event, toState, toParams, fromState, fromParams){
					if(!toState.abstract) {
						$rootScope.pageTitle = toState.pageTitle ? toState.pageTitle : ''
					}
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