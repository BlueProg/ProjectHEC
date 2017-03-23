var app = angular.module('historiqueModule', ['ui.router'])

app.config(function($stateProvider) {
	
	var profileState = {
	  name: 'historique',
	  url: '/historique',
	  templateUrl: 'partials/historique.html'
	}

  	$stateProvider.state(profileState);
})
.controller('HistoriqueController', function ($scope, ServerCommunicationFactory) {
	$scope.test = 'ok'

	$scope.datas = [];
	var month = [
		'Janvier',
		'Février',
		'Mars',
		'Avril',
		'Mai',
		'Juin',
		'Juillet',
		'Août',
		'Septembre',
		'Octobre',
		'Novembre',
		'Décembre'
	]

	$scope.onInit = function() {
		ServerCommunicationFactory.getSendMessage()
		.then(function(data) {
			var datas = data.data;
			for (var i = datas.length - 1; i >= 0; i--) {
				var date = new Date(datas[i].date);
				datas[i].dateParse = date.getUTCDate() + ' ' + month[(date.getUTCMonth())] + ' ' + date.getUTCFullYear() + ' à '
				+ (date.getUTCHours() + 1) + 'h' + date.getUTCMinutes() + '.';
			}
			$scope.datas = data.data;
		})
	}
	$scope.onInit();
})