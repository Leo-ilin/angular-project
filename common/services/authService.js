angular
	.module('common.services')
	.service('Session', [
		'localStorageService',
		function(localStorageService){
			"use strict";
			this.init = function(id){
				return this.id = id || localStorageService.get('sessionId')
			}
			this.create = function (sessionId, userId) {
				this.id = sessionId;
				this.userId = userId;
			};
			this.destroy = function () {
				this.id = null;
				this.userId = null;
			};
			return this;
		}
	])
	.factory('authService', [
		'$rootScope',
		'apiService',
		'localStorageService',
		'Session',
		'$q',
		'AUTH_EVENTS',
		function($rootScope, apiService, localStorageService, Session, $q, AUTH_EVENTS) {
			"use strict";

			var factory = {};

			factory.init = function(id) {
				return Session.init(id)
			}

			//Helper method for check if user authenticated
			factory.check = function check() {
				var deferred = $q.defer();
				apiService.login.isAuthorized()
					.then(
					function(response) {
						if(response.sessionId) {
							Session.create(response.sessionId, response.id || null);
							localStorageService.set('sessionId', response.sessionId);
							$rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
							deferred.resolve(true);
						} else {
							$rootScope.$broadcast(AUTH_EVENTS.loginFailed);
							deferred.resolve(false);
						}
					},
					function(errResponse) {
						deferred.reject(errResponse);
					}
				)

				return deferred.promise
			}

			factory.login = function login(credentials, remember) {
				var deferred = $q.defer();

				apiService.login.login({
					login: credentials.login,
					password: credentials.password
				}).then(
					function(response){
						if(remember) {
							localStorageService.set('sessionId', response.sessionId);
						}
						Session.create(response.sessionId, response.id || null);
						$rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
						deferred.resolve(response);
					},
					function(errResponse){
						$rootScope.$broadcast(AUTH_EVENTS.loginFailed);
						deferred.reject(errResponse);
					}
				)

				return deferred.promise
			}

			factory.logout = function logout(){
				var deferred = $q.defer();
				localStorageService.remove('sessionId');
				Session.destroy();
				apiService.login.logout().then(
					function(response){
						$rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
						deferred.resolve(response);
					}
				)

				return deferred.promise
			}

			factory.isAuthenticated = function isAuthenticated(){
				return !!Session.id
			}

			factory._returnState = null;

			factory.setReturnState = function(state, params) {
				factory._returnState = {
					name: state.name,
					params: params
				}
			}

			factory.getReturnState = function(){
				return factory._returnState
			}

			return factory
		}
	])