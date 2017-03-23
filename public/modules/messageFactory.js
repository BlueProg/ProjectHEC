angular.module('app')
.factory('ServerCommunicationFactory', ['$http', function($http) {

	var factory = {};

	factory.getUserList = function() {
		return $http.get('/userList');
	},
	factory.addUserList = function(data) {
		return $http.post('/userList', data);
	},
	factory.deleteData = function() {
		return $http.delete('/userList');
	},
	factory.sendMessage = function(data) {
		return $http.post('/sendMessage', data);
	},
	factory.getSendMessage = function() {
		return $http.get('/sendMessage');
	}
	return factory;
}])