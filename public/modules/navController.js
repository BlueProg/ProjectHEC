angular.module('navModule', [])
.controller('NavController', function ($scope, TokenService) {
	$scope.isAuthed = function () {
		return TokenService.isAuthed ? TokenService.isAuthed() : false
	}

	$scope.haveRole = function () {
		return TokenService.haveRole ? TokenService.haveRole() : false;
	}
})