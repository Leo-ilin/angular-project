(function(){
'use strict';

	/**
	 * Angular provider for configuring and instantiating as api service.
	 *
	 * @constructor
	 */
	function ApiProvider() {
		this.endpoints = {};
	}

	/**
	 * Rest service name to inject
	 * @type {string}
	 */
	ApiProvider.prototype.restService = 'Restangular';

	/**
	 * Adds endpoint by its route
	 * @param name
	 */
	ApiProvider.prototype.endpoint = function(name, methods) {
		this.endpoints[name] = methods || [];
		return this
	}

	/**
	 * Function invoked by angular to get the instance of the api service.
	 * @return {Object.<string, app.ApiEndpoint>} The set of all api endpoints.
	 */
	ApiProvider.prototype.$get = ['$injector', function($injector) {
		var api = {};

		this.restangular = $injector.get(this.restService);
		var self = this;

		angular.forEach(this.endpoints, function(methods, route, endpoints) {
			var service = api[route] = self.restangular.all(route);
			if(methods.length > 0) {
				angular.forEach(methods, function(method){
					api[route].addRestangularMethod(method.name, method.operation, method.path, method.params, method.headers)
				})
			}
		})

		return api;
	}];

	angular
		.module('common.services')
		.provider('apiService', ApiProvider)

}());