var RegisterMod = angular.module('RegisterMod', ["firebase"]);

RegisterMod.factory("Auth", ["$firebaseAuth",
	function($firebaseAuth) {
		var myFirebaseRef = new Firebase("https://burning-inferno-6071.firebaseio.com/");
		console.log("check");
		return $firebaseAuth(myFirebaseRef);		
	}
	]);

RegisterMod.controller("RegisterCtrl", ["$scope", "Auth",
  function($scope, Auth) {
    $scope.createUser = function() {
      $scope.message = null;
      $scope.error = null;

      Auth.$createUser({
        email: $scope.email,
        password: $scope.password
      }).then(function(userData) {
        $scope.message = "You account has been succesfully created!";
      }).catch(function(error) {
        $scope.error = error;
      });
    };
  }
]);