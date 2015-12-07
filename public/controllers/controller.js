var myApp = angular.module('myApp', []);

myApp.controller('appCtrl', ['$scope', '$http', function($scope, $http) {
	console.log("Controller file is running!");

	// Week array for calendar
	$scope.weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

	// Refreshes the page to update the view with current db info
	var refresh = function() {
		// GET the roles data
		$http.get('/roles').success(function (response) {
			console.log("Successfully pulled the roles data to the controller");
			// Store the JSON response as the exposed variable 'roles'
			$scope.roles = response;
			// Clear the new role input bindings
			$scope.newRole = "";
			$scope.newSharpener = ""; 
			console.log(JSON.stringify(response));
		});

		// GET the 'sharpen the saw' data
		$http.get('/sharpeners').success(function (response) {
			console.log("Successfully pulled the 'sharpen the saw' data to the controller");

			$scope.sharpeners = response;
			console.log(JSON.stringify(response));
		});
	};

	refresh();

	// Button functions

	// Add role or sharpener, based on the type passed (as String) -- not finished
	$scope.addRole = function(type) {
		$scope.newwie = {};
		$scope.newwie.user = 'krisheinrich';  // Change this line later!!!!!
		$scope.newwie.type = type;
		$scope.newwie.name = (type == 'role') ? $scope.newRole : $scope.newSharpener;
		$scope.newwie.tasks = [];
		$scope.newwie.newTask = "";
		console.log($scope.newwie.name);
		// Input validation
		if ($scope.newwie.name == undefined) {
			alert("Please enter a valid name.");
		} else {
			$http.post('/roles', $scope.newwie).success(function (response) {
				console.log(response);
				refresh();		
				$scope.newRole = "";
			});
		}
	};

	// Delete role doc, including all associated tasks
	$scope.deleteRole = function(id, name) {
		var sure = confirm('Are you sure you want to delete the role "' + name + '"?');

		if (sure) {
			console.log(id);
			$http.delete('/roles/' + id).success(function (response) {
				refresh();
			});
		}
		event.stopPropagation();
	};
	
	// Append new task to role/sharpener task list
	$scope.addTaskTo = function(task, id) {
		console.log(task);
		if (task == "") {
			alert("Please enter a task.");
		} else {
			var obj = {name: task};
			$http.put('/roles/' + id, obj).success(function (response) {
				refresh();
			});
		}
	}

	// Delete task from 
	$scope.deleteTask = function (id, task) {
		console.log(id, task);
		$http.put('/roles/' + id + '/'+ task).success(function (response) {
			refresh();
		});
	};

	// Save week task lists to 2-D array
	$scope.save;

}]);


// Custom attribute to allow top most li's (roles/sharpeners) text click to toggle the ul that follows 

myApp.directive("topLevel", function() {
    return {
        restrict: "A",
        link: function(scope, elem, attrs) {
            $(elem).click(function() {
                var target = $(elem).next("ul");
                target.slideToggle();
            });
        }
    }
});