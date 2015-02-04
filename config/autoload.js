angular
	.module('core')
	.config([
		'$ocLazyLoadProvider', 'DEBUG',
		function ($ocLazyLoadProvider, DEBUG) {
			$ocLazyLoadProvider.config({
				debug: DEBUG,
				loadedModules: ['app', 'main'],
				//connect autoloader
				jsLoader: function (libs, callback, pkg) {
					var promises = [];
					for (var i = 0, l = libs.length; i < l; i++) {
						if (angular.isObject(libs[i])) {
							promises.push(libs[i])
						} else {
							promises.push({url: libs[i]});
						}
					}
					basket.require.apply(null, promises).then(callback, callback);
				},
				modules: [
					//define modules for autoload
					{
						name: 'index',
						files: [
							{ url: 'modules/index/index.js' }
						]
					},
					{
						name: 'user',
						files: [
							{ url: 'modules/user/user.js' }
						]
					}
				]
			})
		}
	])
