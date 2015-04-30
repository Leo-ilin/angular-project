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
	.constant('STATE', {
		'LOGIN': 'user.login',
		'HOME': 'index'
	})
	.config(['$httpProvider', function($httpProvider) {
		$httpProvider.interceptors.push('authInterceptor');
	}])
	.run([
		'$rootScope', 'authService', '$state', 'AUTH_EVENTS', 'STATE', 'cfpLoadingBar',
		function authHandler($rootScope, authService, $state, AUTH_EVENTS, STATE, cfpLoadingBar){
			authService.init();

			var start = cfpLoadingBar.start;
			var complete = cfpLoadingBar.complete;

			$rootScope.$on('$stateChangeStart', start)
			$rootScope.$on('$stateChangeSuccess', complete)
			$rootScope.$on('$stateChangeError', complete)

			var goBack = function(){
				complete();
				var lastState = authService.getReturnState();
				if(lastState){
					return $state.go(lastState.name, lastState.params)
				} else {
					return $state.go(STATE.HOME, {})
				}
			}

			$rootScope.$on(AUTH_EVENTS.notAuthenticated, function(e){
				$state.go(STATE.LOGIN);
			})

			$rootScope.$on(AUTH_EVENTS.notAuthorized, function(e){
				//Use this exception when a user has been authenticated but is not allowed to perform the requested action
			})

			$rootScope.$on(AUTH_EVENTS.logoutSuccess, function(e){
				//on user logout remember current state
				authService.setReturnState($rootScope.$state.current, $rootScope.$state.params)
				complete();
				$state.go(STATE.LOGIN);
			})

			$rootScope.$on(AUTH_EVENTS.loginSuccess, goBack)

			$rootScope.$on('$stateChangeStart',
				function(event, toState, toParams, fromState, fromParams) {
					if(!toState.abstract && (toState.name.indexOf('user') === -1)) {
						//remember not abstract and not user module's states
						authService.setReturnState(toState, toParams)
					}

					if(toState.name.indexOf(STATE.LOGIN) > -1) {
						if(authService.isAuthenticated()) {
							event.preventDefault();
							//notify
							goBack();
						} else {
							authService.check().then(
								function(ok) {
									event.preventDefault();
									//notify
									goBack();
								}
							)
						}
					} else {
						//AUTHENTICATION CHECK
						if (toState.authenticate !== false && !authService.isAuthenticated()) {
							//auth required
							event.preventDefault();
							complete();
							$state.go(STATE.LOGIN);
						}
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