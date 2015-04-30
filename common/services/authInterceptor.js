'use strict';

angular
	.module('common.services')
	.constant('AUTH_EVENTS', {
		loginSuccess: 'auth.login.success',
		loginFailed: 'auth.login.failed',
		logoutSuccess: 'auth.logout.success',
		sessionTimeout: 'auth.session.timeout',
		notAuthenticated: 'auth.not.authenticated',
		notAuthorized: 'auth.not.authorized'
	})
	.factory('authInterceptor', [
		'$rootScope', '$q', 'Session', '$injector', 'AUTH_EVENTS',
		function ($rootScope, $q, Session, $injector, AUTH_EVENTS) {

			var authInterceptorServiceFactory = {};

			var _request = function (config) {
				config.headers = config.headers || {};
				config.params = config.params || {};

				if (Session.id) {
					//config.headers.Authorization = 'Bearer ' + sid;
					config.params.session = Session.id;
				}

				return config;
			}

			var _responseError = function (rejection) {
				$rootScope.$broadcast({
					0: AUTH_EVENTS.notAuthenticated,
					401: AUTH_EVENTS.notAuthenticated,
					403: AUTH_EVENTS.notAuthorized,
					419: AUTH_EVENTS.sessionTimeout,
					440: AUTH_EVENTS.sessionTimeout
				}[rejection.status], rejection);

				return $q.reject(rejection)
			}

			authInterceptorServiceFactory.request = _request;
			authInterceptorServiceFactory.responseError = _responseError;

			return authInterceptorServiceFactory;
		}
	]);