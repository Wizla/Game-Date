 ProfileMod = angular.module("ProfileMod", ['firebase']);

 ProfileMod.controller("ProfileCtrl",
 	function($scope) {
 	var myFirebaseRef = new Firebase("https://burning-inferno-6071.firebaseio.com/profile");
 	$scope.addProfile = function(){		
        //myFirebaseRef.push({"user" : {"name" : $scope.name, "lastname" : $scope.lastname}});
        //var newUser = myFirebaseRef.push({'username' : $scope.username});
        //newUser.set({'user' : {'name' : $scope.name, 'lastname' : $scope.lastname}});
        //var newUser.child($scope.username).set({'name' : $scope.name, 'lastname' : $scope.lastname});
        // var userID = newUser.key();
        //console.log(userID);
            //myFirebaseRef.push({'username' : $scope.username});
        	//myFirebaseRef.child($scope.username).push({'name' : $scope.name, 'lastname' : $scope.lastname});
       // var newUser = myFirebaseRef.push({'username' : $scope.username});
      // newUser.set({'name' : $scope.name, 'lastname' : $scope.lastname});
        //newUser.child('username')
        //var userID = newUser.key();
        console.log(authData.uid);

        
 	}
 });


