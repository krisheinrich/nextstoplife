var myApp = angular.module('myApp', []);

myApp.controller('tasksCtrl', ['$scope', '$http', function($scope, $http) {
	console.log("Controller file is running!");

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

	// Add role or sharpener, based on the type passed (as String)
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
	$scope.deleteTaskFrom = function (task, id) {
		console.log(id, task);
		var obj = {name: task};
		$http.put('/roles/del/' + id, obj).success(function (response) {
			refresh();
		});
	};

}]);


// Controller for this week's calendar section

myApp.controller('weekCtrl', ['$scope', '$http', function($scope, $http) {

	// Week array for calendar
	$scope.weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

	// Reset week data
	$scope.weekObj = {};
	for (var i = 0; i<7; i++) {
		$scope.weekObj[$scope.weekdays[i].toLowerCase()] = [];
	}

	// Refreshes the week info
	var refresh = function() {

		// GET the week's data
		$http.get('/weekItems').success(function (response) {
			console.log("Successfully pulled the week data to the controller");
			$scope.weekObj = {};
			for (var i = 0; i < response.length; i++) {
				var day = response[i].day;
				var tasks = response[i].tasks;
				$scope.weekObj[day] = tasks;
			}
		});
	};

	refresh();

	/*
	// Drag and Drop

	$scope.handleDrop = function(item, slot) {
		alert('Item ' + item + ' has been dropped into ' + slot);
	}
	*/

	// BUTTONS for week view

	// Save week task lists to DB
	$scope.saveWeek = function () {
		var obj = $scope.weekObj;
		console.log(obj);
		$http.post('/weekItems', obj).success(function (response) {
				console.log(response);
				//refresh();
			});
	};

	// Clear week display
	$scope.clearWeek = function() {
		$scope.weekObj = {};
		for (var i = 0; i<7; i++) {
			$scope.weekObj[$scope.weekdays[i].toLowerCase()] = [];
		}
	};

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

// Drag and drop functions

myApp.directive('draggable', function() {
  return function(scope, element) {
    // this gives us the native JS object
    var el = element[0];
    
    el.draggable = true;
    
    el.addEventListener(
      'dragstart',
      function(e) {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('Text', this.innerHTML);
        this.classList.add('drag');
        return false;
      },
      false
    );
    
    el.addEventListener(
      'dragend',
      function(e) {
        this.classList.remove('drag');
        return false;
      },
      false
    );
  }
});

myApp.directive('droppable', function() {
  return {
    scope: {
      drop: '&',
      ngModel: '='
    },
    link: function(scope, element) {
      // again we need the native object
      var el = element[0];
      
      el.addEventListener(
        'dragover',
        function(e) {
          e.dataTransfer.dropEffect = 'move';
          // allows us to drop
          if (e.preventDefault) e.preventDefault();
          this.classList.add('over');
          return false;
        },
        false
      );
      
      el.addEventListener(
        'dragenter',
        function(e) {
          this.classList.add('over');
          return false;
        },
        false
      );
      
      el.addEventListener(
        'dragleave',
        function(e) {
          this.classList.remove('over');
          return false;
        },
        false
      );
      
      el.addEventListener(
        'drop',
        function(e) {
          // Stops some browsers from redirecting.
          if (e.stopPropagation) e.stopPropagation();
          
          this.classList.remove('over');
          
          var binId = this.id;
          var text = e.dataTransfer.getData('Text');
          //var item = document.createTextNode(text);
          //this.appendChild(item); 
          //var split = binId.split('-');
          //var weekday = split[0];
          //var pos = split[1];
          //scope.weekObj[weekday.toLowerCase()].push(text);
          scope.ngModel = text;
          
          return false;
        },
        false
      );
    }
  }
});





