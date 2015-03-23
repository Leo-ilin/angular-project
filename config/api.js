angular
	.module('common.services')
	.config(['RestangularProvider', function(RestangularProvider) {
		"use strict";
		//Let's configure Rastangular globally

		RestangularProvider.setBaseUrl('../api/');

		RestangularProvider.setDefaultHttpFields({cache: false, _format: 'json'});

		RestangularProvider.setResponseExtractor(function(response, operation) {
			if('getList' === operation && angular.isArray(response.items)) {
				return response.items;
			} else {
				return response
			}
		});
	}])
	.config(['apiServiceProvider', function(apiServiceProvider){
		apiServiceProvider
			.endpoint('user')
			.endpoint('login', [
				{
					name: 'login',
					operation: 'post',
					path: 'login'
				},
				{
					name: 'logout',
					operation: 'post',
					path: 'logout'
				}
			])

	}])