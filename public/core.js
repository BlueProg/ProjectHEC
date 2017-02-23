
var scotchTodo = angular.module('scotchTodo', []);

function mainController($scope, $http) {
	$scope.userList = [];
	$scope.validLength = 5;
	$scope.diffList = [];
	$scope.dataExcell = null;

	$http.get('/userList')
		.success(function(data) {
			$scope.userList = data;
			angular.forEach(data, function(valueData, valueIndex) {
				angular.forEach(valueData.list, function(valueUserInfo, keyUserInfo) {
					var find = false;
					angular.forEach($scope.diffList, function(valueDiff, keyDiff) {
						if (valueDiff.name == valueUserInfo)
							find = true;
					})
					if (find == false)
						$scope.diffList.push({"name" : valueUserInfo, "isChecked": false});	
				})
			})
		})
		.error(function(err) {
			console.log('Error: ' + err);
		})

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

	$scope.uploadExcell = function($event) {
		console.log($event);
	}

	 var target = angular.element('#inputExcell');
	 console.log(target);
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

            var data = XLSX.utils.sheet_to_json( workbook.Sheets[workbook.SheetNames[0]]);
            console.log(data);
            $scope.dataExcell = data;
            target.val(null);
          });
        };
        reader.readAsBinaryString(changeEvent.target.files[0]);
	 })
}

scotchTodo.directive('wmBlock', function ($parse) {
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
/*
scotchTodo.directive("fileread", [function () {
  return {
    scope: {
      opts: '='
    },
    link: function ($scope, $elm, $attrs) {
    	console.log($elm);
      $elm.on('change', function (changeEvent) {
        var reader = new FileReader();

        reader.onload =function (evt) {
          $scope.$apply(function () {
            var data = evt.target.result;
            var workbook = XLSX.read(data, {type: 'binary'});
            var headerNames = XLSX.utils.sheet_to_json(
				workbook.Sheets[workbook.SheetNames[0]],
				{ header: 1 }
			)[0];

            var data = XLSX.utils.sheet_to_json( workbook.Sheets[workbook.SheetNames[0]]);
            console.log(data);
            $scope.dataExcell = data;
            
            $elm.val(null);
          });
        };

        reader.readAsBinaryString(changeEvent.target.files[0]);
      });
    }
  }
}]);*/