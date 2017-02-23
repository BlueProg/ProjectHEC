
var scotchTodo = angular.module('scotchTodo', []);

function mainController($scope, $http) {
	$scope.userList = [];
	$scope.validLength = 5;
	$scope.diffList = [];

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