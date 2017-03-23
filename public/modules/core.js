var app = angular.module('app', ['historiqueModule', 'registerModule', 'profileModule', 'navModule', 'ngAnimate', 'ngSanitize', 'ui.bootstrap', 'ui.router'])

app.config(function($stateProvider, $httpProvider) {

	$httpProvider.interceptors.push('InterceptorFactory');
	var mainState = {
		name: 'main',
		url: '/mainUrl',
		templateUrl: 'partials/main.html'
	}

	var otherwise = {
		name: 'otherwise',
		url: '*path',
		templateUrl: 'partials/login.html'
	}

	$stateProvider.state(mainState);
	$stateProvider.state(otherwise);
})
.controller('SpredController', function ($scope, $http, $window, ServerCommunicationFactory, ServerAuthFactory, TokenService) {
	$scope.userList = [];
	$scope.validLength = 159;
	$scope.diffList = [];
	$scope.showUpload = true;
	$scope.expeditor = TokenService.getName();

	ServerCommunicationFactory.getUserList().then(function (result) {

		console.log(result);
		if (result.data && result.data.data && result.data.status == 400) {
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
		  	toastr.error(result.data.data.info);
		  	var url = "http://" + $window.location.host + "/";
		  	$window.location.href = url;
		}
		else {
			$scope.data = result.data.data.data;
		}
	});
	
	$scope.title = 'Spred';
	$scope.totalItems = 3;
	$scope.currentPage = 1;
	$scope.modalDest = '';
	$scope.modalFilter = '';
	$scope.modalNumber = '';

	$scope.setPage = function (pageNo) {
		$scope.currentPage = pageNo;
	};

	$scope.pageChanged = function() {

	};

	$scope.userFilter = [];
	$scope.showPage = function() {
		return $scope.currentPage;
	}

	function	applyFilter() {
		var find;
		for (var i = $scope.data.dest.length - 1; i >= 0; i--) {
			$scope.data.dest[i].isChecked = false;
			find = false;
			for (var j = $scope.data.dest[i].filtre.length - 1; j >= 0; j--) {
				for (var k = $scope.data.filter.length - 1; k >= 0; k--) {
					for (var l = $scope.data.filter[k].data.length - 1; l >= 0; l--) {
						if ($scope.data.filter[k].data[l].isChecked && $scope.data.filter[k].data[l].name == $scope.data.dest[i].filtre[j]) {
							$scope.data.dest[i].isChecked = true;
							find = true;
						}
						if (find)
							break;
					}
					if (find)
						break;
				}
				if (find)
					break;
			}
		}
	}

	$scope.selectUserList = function($event, data) {

		for (var i = $scope.userFilter.length - 1; i >= 0; i--) {
			if ($scope.userFilter[i].nameList == data.name) {
				for (var j = $scope.userFilter[i].elemList.length - 1; j >= 0; j--) {
					if ($scope.userFilter[i].elemList[j].name == $event.name) {
						$scope.userFilter[i].elemList[j].isChecked = $event.isChecked;
						return (applyFilter());
					}
				}
				$scope.userFilter[i].elemList.push({'name': $event.name, 'isChecked': $event.isChecked});
				return (applyFilter());
			}
		}
		$scope.userFilter.push({'nameList': data.name, 'elemList' : [{'name': $event.name, 'isChecked': $event.isChecked}]});
		return (applyFilter());
	}

	$scope.confirmSend = function() {
		var data = [];
		if ($scope.data && $scope.data.dest) {
			for (var i = $scope.data.dest.length - 1; i >= 0; i--) {
				if ($scope.data.dest[i].isChecked) {
					data.push($scope.data.dest[i]);
				}
			}
			ServerCommunicationFactory.sendMessage({"message" : $scope.dataTextarea, "data": data, "expeditor": $scope.expeditor}).then(function(result) {
				console.log(result);
				if (result.data && result.data.data && result.data.status == 400) {
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
				  	toastr.error(result.data.data.info);
				  	var url = "http://" + $window.location.host + "/";
				  	$window.location.href = url;
				}
				else if (result == 200) {
					$scope.dataTextarea = "";	
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
				  	toastr.success('Message envoyé avec succès !');
				}
				$('#confirmModal').modal('hide');
			});
		}1
	}

	$scope.send = function() {

		var data = [];
		if ($scope.dataTextarea.length > 0)
			$('#confirmModal').modal('show');
		if ($scope.data && $scope.data.dest) {
			for (var i = $scope.data.dest.length - 1; i >= 0; i--) {
				if ($scope.data.dest[i].isChecked) {
					data.push($scope.data.dest[i]);
				}
			}
			$scope.dataCount = data;
		}
	}

	$scope.delete = function() {
		ServerCommunicationFactory.deleteData().then(function(result) {
			if (result.data && result.data.data && result.data.status == 400) {
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
				  	toastr.error(result.data.data.info);
				  	var url = "http://" + $window.location.host + "/";
				  	$window.location.href = url;
			}
			else {
				$scope.userList = result.data;
				$scope.data = "";
				cleanImport();
			}
		});
	}

	var target = angular.element('#inputExcell');
	target.on('change', function(changeEvent) {
	 	var reader = new FileReader();

        reader.onload =function (evt) {
          $scope.$apply(function () {
            var data = evt.target.result;
            var workbook = XLSX.read(data, {type: 'binary'});
            var headerNames = XLSX.utils.sheet_to_json(
				workbook.Sheets[workbook.SheetNames[0]],
				{ header: 1 }
			)[0];
            var result = XLSX.utils.sheet_to_json( workbook.Sheets[workbook.SheetNames[0]]);        
        	$scope.resultExcel = result;
        	$scope.showUpload = false;
        	var typeColum = [];
        	if (result.length > 0) {
        		for (var property in result[0]) {
				    if (result[0].hasOwnProperty(property)) {
				        typeColum.push({"nameColum": property, "isChecked": false});
				    }
				}
        	}
        	$scope.modalDest = angular.copy(typeColum);
           	$scope.modalFilter = angular.copy(typeColum);
        	$scope.modalNumber = angular.copy(typeColum);
            target.val(null);
          });
        };
        reader.readAsBinaryString(changeEvent.target.files[0]);
	})

	$scope.modalClose = function() {
		cleanImport();
	}

	$scope.changeRenduType = function() {
		var renduString = "";
		for (var i = $scope.modalDest.length - 1; i >= 0; i--) {
			if ($scope.resultExcel.length > 0) {
				if ($scope.modalDest[i].isChecked) {
					renduString += ' ' + $scope.resultExcel[0][$scope.modalDest[i].nameColum];
				}
			}
		}
		$scope.renduType = renduString;
	}

	$scope.modalSave = function() {
		var data = {
			"dest": [],
			"filter": [],
			"number": [],
			"allData": []
		};
		if ($scope.resultExcel) {
			data.allData = angular.copy($scope.resultExcel);
			data.dest = parseUser($scope.modalDest, $scope.modalFilter, $scope.modalNumber);
			for (var i = $scope.modalFilter.length - 1; i >= 0; i--) {
				if ($scope.modalFilter[i].isChecked) {
					data.filter.push({
						"name": $scope.modalFilter[i].nameColum,
						data: parseList(data.allData, $scope.modalFilter[i].nameColum)
					});
				}
			}
			for (var i = $scope.modalNumber.length - 1; i >= 0; i--) {
				if ($scope.modalNumber[i].isChecked) {
					data.number.push({
						"name": $scope.modalNumber[i].nameColum,
						data: parseList(data.allData, $scope.modalNumber[i].nameColum)
					});
				}
			}
			ServerCommunicationFactory.addUserList(data).then(function(result) {
				if (result.data && result.data.data && result.data.status == 400) {
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
				  	toastr.error(result.data.data.info);
				  	var url = "http://" + $window.location.host + "/";
				  	$window.location.href = url;
				}
				else {
					$scope.data = result.data.data.data;
					cleanImport();
				}
			});
		}
	}

	function cleanImport() {
		$scope.resultExcel = null;
		$scope.showUpload = true;
		$scope.modalDest = "";
		$scope.renduType = null;
	}

	function formatFilter(result, user) {
		var filter = [];
		for (var i = result.length - 1; i >= 0; i--) {
			if (result[i].isChecked) {
				filter.push(user[result[i].nameColum]);
			}
		}
		return filter;
	}

	function parseUser(result, filter, number) {
		var viewData = [];
		var allData = angular.copy($scope.resultExcel);
		for (var i = allData.length - 1; i >= 0; i--) {
			if (filter) {
				viewData.push({
					"name": formatName(result, allData[i]),
					"isChecked": false,
					"filtre": formatFilter(filter, allData[i]),
					"number": formatNumber(number, allData[i])
				});	
			}
		}
		return viewData;
	}

	function formatNumber(list, user) {
		var numberString = "";
		for (var i = list.length - 1; i >= 0; i--) {
			if (list[i].isChecked) {
				numberString = user[list[i].nameColum];
			}
		}
		return numberString;
	}

	function formatName(format, object) {

		var nameString = "";
		for (var i = format.length - 1; i >= 0; i--) {
			if (format[i].isChecked) {
				nameString += object[format[i].nameColum] + " ";
			}
		}
		return nameString;
	}

	function parseList(data, type) {
		var parseDiffList = [];
		if (data) {
			for (var i = data.length - 1; i >= 0; i--) {
				var find = false;
				for (var k = parseDiffList.length - 1; k >= 0; k--) {
					if (parseDiffList[k].name == data[i][type])
						find = true;
				}
				if (find == false)
					parseDiffList.push({"name" : data[i][type], "isChecked": false});	
			}
		}
		return parseDiffList;
	}
})
.directive('wmBlock', function ($parse) {
    return {
        scope: {
          wmBlockLength: '='
        },
        link: function (scope, elm, attrs) {
         
          elm.bind('keypress', function(e){
           
            if(elm[0].value.length > scope.wmBlockLength){
              e.preventDefault();
              return false;
            }
          });
        }
    }   
});
