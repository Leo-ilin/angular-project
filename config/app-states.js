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
						_loadModule: function($ocLazyLoad) {
							return $ocLazyLoad.load('index')
						}
					},
					authenticate: false,
					pageTitle: 'Главная страница'
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
					controller: 'LoginController',
					resolve: {
					},
					authenticate: false,
					pageTitle: 'Авторизация'
				})
				.state('404', {
					url: '/404',
					templateUrl: 'layouts/404.html',
					authenticate: false,
					pageTitle: 'Страница не найдена'
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
					console.log(event.name, toState.name);
				})
			$rootScope.$on('$stateChangeSuccess',
				function(event, toState, toParams, fromState, fromParams){
					console.log(event.name, toState.name);
				})
			$rootScope.$on('$stateChangeError',
				function(event, toState, toParams, fromState, fromParams, error){
					console.error(event.name, error)
					console.log(event, toState, toParams, fromState, fromParams)
				})
			$rootScope.$on('$stateNotFound',
				function(event, unfoundState, fromState, fromParams){
					console.warn(event.name, unfoundState.to);
					console.warn(unfoundState.toParams);
					console.warn(unfoundState.options); // {inherit:false} + default options
				})
		}
	])