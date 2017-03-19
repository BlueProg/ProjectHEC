var app = angular.module('profileModule', ['ui.router'])

app.config(function($stateProvider) {
	
	var profileState = {
	  name: 'profile',
	  url: '/profile',
	  templateUrl: 'partials/profile.html'
	}

  	$stateProvider.state(profileState);
})
.controller('ProfileController', function ($scope) {

})