angular
	.module('core')
	.config(['$compileProvider', 'DEBUG', function($compileProvider, DEBUG){
		$compileProvider.debugInfoEnabled(DEBUG);
	}])
	.config(['$rootScopeProvider', 'DEBUG', function ($rootScopeProvider, DEBUG) {
		//workaround for the issue that appears for depths >=10
		//took from https://github.com/angular/angular.js/issues/6440
		//$rootScopeProvider.digestTtl(20);
	}])
	.config(function(cfpLoadingBarProvider) {
		cfpLoadingBarProvider.includeBar = true;
		cfpLoadingBarProvider.includeSpinner = true;
	})