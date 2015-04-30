var App = {};
App.DEBUG = true;

(function(){
	var UNIQUE_KEY = 0.002,
		DEFAULT_EXPIRE = 7 * 24;

	if(App.DEBUG) {
		basket.clear();
	}

	basket.require(
		{ url: 'vendors/lodash/dist/lodash.underscore.min.js', unique: '2.4.1' },
		{ url: 'vendors/angular/angular.js', unique: '1.3.12' },
		{ url: 'vendors/angular-animate/angular-animate.min.js' },
		{ url: 'vendors/angular-local-storage/dist/angular-local-storage.min.js', unique: '0.1.4' },
		{ url: 'vendors/oclazyload/dist/ocLazyLoad.min.js' },
		{ url: 'vendors/angular-ui-router/release/angular-ui-router.min.js', unique: '0.2.13' },
		{ url: 'vendors/restangular/dist/restangular.min.js', unique: '1.4.0' },
		{ url: 'vendors/angular-loading-bar/build/loading-bar.min.js' }
	)
	.then(
		function(){
			basket.require(
				{ url: 'common/services/services.js', expire: DEFAULT_EXPIRE, unique: UNIQUE_KEY },
				{ url: 'common/services/apiService.js', expire: DEFAULT_EXPIRE, unique: UNIQUE_KEY },
				{ url: 'common/services/authService.js', expire: DEFAULT_EXPIRE, unique: UNIQUE_KEY },
				{ url: 'config/main.js', expire: DEFAULT_EXPIRE, unique: UNIQUE_KEY, skipCache: true },
				{ url: 'common/services/authInterceptor.js', expire: DEFAULT_EXPIRE, unique: UNIQUE_KEY },
				{ url: 'config/common.js', expire: DEFAULT_EXPIRE, unique: UNIQUE_KEY },
				{ url: 'config/autoload.js', expire: DEFAULT_EXPIRE, unique: UNIQUE_KEY, skipCache: true },
				{ url: 'config/app-states.js', expire: DEFAULT_EXPIRE, unique: UNIQUE_KEY, skipCache: true },
				{ url: 'config/api.js', expire: DEFAULT_EXPIRE, unique: UNIQUE_KEY },
				{ url: 'modules/app/app.js', expire: DEFAULT_EXPIRE, unique: UNIQUE_KEY }
			).then(
				function(){
					//Run
					angular.element(document).ready(function () {
						angular.bootstrap(document, ['app'])
					})
				},
				function(error) {
					throw new Error(error)
				}
			)
		},
		function(error){
			throw new Error(error)
		}
	)
}())