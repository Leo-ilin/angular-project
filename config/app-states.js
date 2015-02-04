angular
	.module('core')
	.config([
		'$stateProvider', '$urlRouterProvider',
		function($stateProvider, $urlRouterProvider) {
			"use strict";

			$stateProvider
				.state('index', {
					url: '/',
					templateUrl: 'layouts/main.html',
					resolve: {
						_loadChartModule: function($ocLazyLoad) {
							return $ocLazyLoad.load('index')
						}
					},
					authenticate: false
				})
				.state('user', {
					abstract: true,
					url: '/user',
					templateUrl: 'layouts/user.html',
					resolve: {
						_loadUserModule: function($ocLazyLoad){
							return $ocLazyLoad.load('user')
						}
					}
				})
				.state('user.login', {
					url: '/login',
					templateUrl: 'modules/user/views/login.html',
					controller: 'loginController',
					resolve: {
						_loadLoginCtrl: function($ocLazyLoad){
							return $ocLazyLoad.load({
								name: 'user',
								files: [
									{ url: 'modules/user/controllers/loginController.js' }
								]
							})
						}
					},
					authenticate: false
				})
				.state('404', {
					url: '/404',
					templateUrl: 'layouts/404.html',
					authenticate: false
				})

			$urlRouterProvider.when("", "/");

			$urlRouterProvider.otherwise(function($injector, $location) {
				console.warn('[appStates] location is not defined!');
				$injector.get('$state').go('404')
			});
		}
	])
	.run([
		'$rootScope', '$state', 'authService',
		function($rootScope, $state, authService){
			"use strict";

			$rootScope.$state = $state;

			$rootScope.$on('$stateChangeStart',
				function(event, toState, toParams, fromState, fromParams){
					console.log('Loading state', toState.name);
					//AUTHENTICATION CHECK
					if(toState.authenticate !== false && !authService.isAuthenticated()) {
						if(!toState.abstract && toState.name.indexOf('user') === -1) {
							authService.setReturnState(toState, toParams);
						}
						$state.transitionTo('user.login');
						event.preventDefault();
					}
				})
			$rootScope.$on('$stateChangeSuccess',
				function(event, toState, toParams, fromState, fromParams){
					console.log('Loaded state', toState.name);
					if(!fromState.abstract && toState.name.indexOf('user') === -1) {
						authService.setReturnState(fromState, fromParams)
					}
				})
			$rootScope.$on('$stateChangeError',
				function(event, toState, toParams, fromState, fromParams, error){
					console.error('stateChangeError', error)
					console.log(event, toState, toParams, fromState, fromParams)
				})
			$rootScope.$on('$stateNotFound',
				function(event, unfoundState, fromState, fromParams){
					console.warn('State not found', unfoundState.to);
					console.warn(unfoundState.toParams);
					console.warn(unfoundState.options); // {inherit:false} + default options
				})
		}
	])