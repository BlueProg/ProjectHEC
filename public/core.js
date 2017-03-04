
var scotchTodo = angular.module('scotchTodo', ['ngAnimate', 'ngSanitize', 'ui.bootstrap'])

.controller('SpredController', function ($scope, $http, ServerCommunicationFactory) {
	$scope.userList = [];
	$scope.validLength = 139;
	$scope.validTitleLength = 19;
	$scope.diffList = [];
	$scope.showUpload = true;

	ServerCommunicationFactory.getUserList().then(function (result) {

		if (result.data.allData)
			$scope.data = result.data;
	});
	

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


	$scope.showPage = function() {
		return $scope.currentPage;
	}

	$scope.selectUserList = function($event) {
		angular.forEach($scope.userList, function(value, key) {
			if (value.list.includes($event.name)) {
				if ($event.isChecked)
					$scope.userList[key].isChecked = true;
				else
					$scope.userList[key].isChecked = false;
			}
		})
	}

	$scope.send = function() {
		ServerCommunicationFactory.sendMessage({"title" : $scope.dataText, "message" : $scope.dataTextarea}).then(function(result) {
			if (result == 200) {
				$scope.dataText = "";
				$scope.dataTextarea = "";	
			}
		});
	}

	$scope.delete = function() {
		ServerCommunicationFactory.deleteData().then(function(result) {
			$scope.userList = result.data;
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
			data.allData = $scope.resultExcel;
			data.dest = parseUser($scope.modalDest, 1);
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
				$scope.data = data;
				cleanImport();
			});
		}
	}

	function cleanImport() {
		$scope.resultExcel = null;
		$scope.showUpload = true;
		$scope.modalDest = "";
		$scope.renduType = null;
	}

	function parseUser(result, multi) {
		var viewData = [];
		var allData = $scope.resultExcel;
		for (var i = allData.length - 1; i >= 0; i--) {
			if (multi == 1) {
				viewData.push({
					"name": formatName(result, allData[i]),
					"isChecked": false
				});	
			}
			else {
				viewData.push({
					"name": allData[i],
					"isChecked": false
				});	
			}
		}
		return viewData;
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
	}
	return factory;
}])

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
