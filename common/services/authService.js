angular
	.module('common.services')
	.service('Session', [
		'localStorageService',
		function(localStorageService){
			"use strict";
			this.init = function(){
				return this.id = localStorageService.get('sessionId')
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
		'apiService',
		'localStorageService',
		'Session',
		'$q',
		function(apiService, localStorageService, Session, $q) {
			"use strict";

			var factory = {};

			factory.init = function() {
				return Session.init()
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
						Session.create(response.sessionId, null);
						deferred.resolve(response);
					},
					function(errResponse){
						deferred.reject(errResponse);
					}
				)

				return deferred.promise
			}

			factory.logout = function logout(){
				localStorageService.remove('sessionId');
				Session.destroy();
				return apiService.login.logout()
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