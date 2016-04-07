 ProfileMod = angular.module("ProfileMod", ['firebase']);

 ProfileMod.controller("ProfileCtrl",function($scope) {
 	var myFirebaseRef = new Firebase("https://burning-inferno-6071.firebaseio.com/profile");
 	$scope.addProfile = function(){		
        //myFirebaseRef.push({"user" : {"name" : $scope.name, "lastname" : $scope.lastname}});
        var newUser = myFirebaseRef.push($scope.username);
        newUser.set({'user' : {'name' : $scope.name, 'lastname' : $scope.lastname}});

        var userID = newUser.key();
        console.log(userID);

        	//myFirebaseRef.push({"username" : $scope.username});
        	//myFirebaseRef.child('username').push({'name' : $scope.name, 'lastname' : $scope.lastname});
        
 	}
 });


