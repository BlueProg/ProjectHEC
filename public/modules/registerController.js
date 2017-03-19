var app = angular.module('registerModule', ['ui.router'])

app.config(function($stateProvider) {
	
	var aboutState = {
	  name: 'login',
	  url: '/login',
	  templateUrl: 'partials/login.html'
	}

  	$stateProvider.state(aboutState);
})
.controller('RegisterController', function ($location, $scope, $http, ServerAuthFactory, TokenService) {

	$scope.isAuthed = function () {
		 return TokenService.isAuthed ? TokenService.isAuthed() : false
	}

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

	$scope.logout = function () {
		TokenService.logout();
	}

	$scope.login = function(user) {

		ServerAuthFactory.LoginUser({ 'email': user.email, 'pass': user.pass})
			.then(function (data) {
				if (data.data.status == 400) {
					toastr.options = {
					  "closeButton": true,
					  "debug": false,
					  "newestOnTop": false,
					  "progressBar": false,
					  "positionClass": "toast-top-center",
					  "preventDuplicates": false,
					  "onclick": null,
					  "showDuration": "300",
					  "hideDuration": "1000",
					  "timeOut": "8000",
					  "extendedTimeOut": "1000",
					  "showEasing": "swing",
					  "hideEasing": "linear",
					  "showMethod": "fadeIn",
					  "hideMethod": "fadeOut"
					}
				  	toastr.error(data.data.data.info, 'Error');
				}
				else {
					toastr.options = {
					  "closeButton": true,
					  "debug": false,
					  "newestOnTop": false,
					  "progressBar": false,
					  "positionClass": "toast-top-center",
					  "preventDuplicates": false,
					  "onclick": null,
					  "showDuration": "300",
					  "hideDuration": "1000",
					  "timeOut": "4000",
					  "extendedTimeOut": "1000",
					  "showEasing": "swing",
					  "hideEasing": "linear",
					  "showMethod": "fadeIn",
					  "hideMethod": "fadeOut"
					}
				  		toastr.success(data.data.data.info, 'Success');
				}
			})
	}

	$scope.register = function(user) {
		if ($scope.reg_confpass == user.reg_pass) {
			ServerAuthFactory.RegisterUser({ 'user': user.reg_name, 'pass': user.reg_pass, 'email': user.reg_email, })
			.then(function (data) {
				if (data.data.status == 400) {
					toastr.options = {
						  "closeButton": true,
						  "debug": false,
						  "newestOnTop": false,
						  "progressBar": false,
						  "positionClass": "toast-top-center",
						  "preventDuplicates": false,
						  "onclick": null,
						  "showDuration": "300",
						  "hideDuration": "1000",
						  "timeOut": "4000",
						  "extendedTimeOut": "1000",
						  "showEasing": "swing",
						  "hideEasing": "linear",
						  "showMethod": "fadeIn",
						  "hideMethod": "fadeOut"
					}
			  		toastr.error(data.data.data.info, 'Error');	
				}
				else {
					toastr.options = {
						  "closeButton": true,
						  "debug": false,
						  "newestOnTop": false,
						  "progressBar": false,
						  "positionClass": "toast-top-center",
						  "preventDuplicates": false,
						  "onclick": null,
						  "showDuration": "300",
						  "hideDuration": "1000",
						  "timeOut": "4000",
						  "extendedTimeOut": "1000",
						  "showEasing": "swing",
						  "hideEasing": "linear",
						  "showMethod": "fadeIn",
						  "hideMethod": "fadeOut"
					}
			  		toastr.success(data.data.data.info, 'Success');
					$location.path('/');	  		
				}
			})
		}
	}
})
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