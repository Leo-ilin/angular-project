angular
	.module('common.services')
	//.value('apiBaseUrl', '/../api/web/')
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
	.factory('StatisticsRestangular', 'apiBaseUrl', function(Restangular, apiBaseUrl) {
		return Restangular.withConfig(function(RestangularConfigurer) {
			RestangularConfigurer.setBaseUrl(apiBaseUrl);
		});
	})
	.config(['apiServiceProvider', function(apiServiceProvider){
		//apiServiceProvider.restService = 'StatisticsRestangular';//кастомный сервис должен быть доступен для апи модуля

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