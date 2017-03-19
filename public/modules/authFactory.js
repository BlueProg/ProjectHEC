angular.module('app')
.factory('ServerAuthFactory', ['$http', function($http) {

	var factory = {};

	factory.LoginUser = function(data) {
		return $http.post('/auth/login', data);
	},
	factory.RegisterUser = function(data) {
		return $http.post('/auth/signup', data);
	}
	return factory;
}])