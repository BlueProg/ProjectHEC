var scotchTodo = angular.module('scotchTodo')

scotchTodo.controller('RegisterController', function ($scope, $http, ServerAuthFactory) {
	$(function() {
	    $('#login-form-link').click(function(e) {
	    	$("#login-form").delay(100).fadeIn(100);
	 		$("#register-form").fadeOut(100);
			$('#register-form-link').removeClass('active');
			$(this).addClass('active');
			e.preventDefault();
		});
		$('#register-form-link').click(function(e) {
			$("#register-form").delay(100).fadeIn(100);
	 		$("#login-form").fadeOut(100);
			$('#login-form-link').removeClass('active');
			$(this).addClass('active');
			e.preventDefault();
		});
	});

	$scope.login = function(user) {
		console.log('user');
		console.log(user);
		ServerAuthFactory.LoginUser({ 'user': user.name, 'pass': user.pass})
			.then(function (err, data) {
				if (err)
					console.log(err);
				else
					console.log(data);
			})
	}

	$scope.register = function(user) {
		if ($scope.reg_confpass == $scope.reg_pass) {
			console.log('ok');
		}
	}
})

.factory('ServerAuthFactory', ['$http', function($http) {

	var factory = {};

	factory.LoginUser = function(data) {
		return $http.post('/auth/login', data);
	},
	factory.RegisterUser = function(data) {
		return $http.post('/auth/register', data);
	}
	return factory;
}])


.directive('pwCheck', [function () {
    return {
        require: 'ngModel',
        link: function (scope, elem, attrs, ctrl) {
            var firstPassword = '#' + attrs.pwCheck;

            elem.add(firstPassword).on('keyup', function () {
                scope.$apply(function () {
                    ctrl.$setValidity('pwmatch', elem.val() === $(firstPassword).val());
                });
            });
        }
    }
}]);