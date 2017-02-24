
var scotchTodo = angular.module('scotchTodo', [])

.controller('SpredController', function ($scope, $http, ServerCommunicationFactory) {
	$scope.userList = [];
	$scope.validLength = 42;
	$scope.validTitleLength = 10;
	$scope.diffList = [];
	$scope.dataExcell = null;

	ServerCommunicationFactory.getUserList().then(function (result) {
		if (result.status == 200) {
			$scope.userList = result.data;
			$scope.diffList = parseList(result.data);
		}
	});
	
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
		console.log($scope.dataTextarea);
		ServerCommunicationFactory.sendMessage({"title" : $scope.dataText, "message" : $scope.dataTextarea}).then(function(result) {
			if (result == 200) {
				$scope.dataText = "";
				$scope.dataTextarea = "";	
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

            var data = XLSX.utils.sheet_to_json( workbook.Sheets[workbook.SheetNames[0]]);
            ServerCommunicationFactory.addUserList(data).then(function(result) {
            	$scope.userList = result.data;
            	$scope.diffList = parseList(result.data);
            });
            target.val(null);
          });
        };
        reader.readAsBinaryString(changeEvent.target.files[0]);
	 })

	 $scope.modalClose = function() {
		$scope.dataExcell = null;
	}

	function parseList(data) {
		var parseDiffList = [];
		for (var i = data.length - 1; i >= 0; i--) {
			for (var j = data[i].list.length - 1; j >= 0; j--) {
				var find = false;
				for (var k = parseDiffList.length - 1; k >= 0; k--) {
					if (parseDiffList[k].name == data[i].list[j])
						find = true;
				}
				if (find == false)
					parseDiffList.push({"name" : data[i].list[j], "isChecked": false});	
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
