var myApp = angular.module('RegisterMod', ["firebase"]);

//RegisterMod.factory("Auth", ["$firebaseAuth",
	//function($firebaseAuth) {
		//var myFirebaseRef = new Firebase("https://burning-inferno-6071.firebaseio.com/");
		//console.log("check");
		//return $firebaseAuth(myFirebaseRef);		
	//}
	//]);



myApp.controller("RegisterCtrl", ["$scope", "Auth",
  function($scope, Auth) {
    $scope.createUser = function() {
      $scope.message = null;
      $scope.error = null;

      Auth.$createUser({
        email: $scope.email,
        password: $scope.password
      }).then(function(userData) {
        $scope.message = "You account has been succesfully created!";
        console.log(userData.uid);
      }).catch(function(error) {
        $scope.error = error;
      });
    };
  }
]);



  //myApp = angular.module('LoginMod', ['firebase']);

    myApp.controller("LoginCtrl", ["$scope", "$firebaseAuth", "$window",
        function($scope, $firebaseAuth, $window) {
            var myFirebaseRef = new Firebase("https://burning-inferno-6071.firebaseio.com/");
            auth = $firebaseAuth(myFirebaseRef);
            $scope.login = function(email,password) {
                auth.$authWithPassword({
        email: $scope.email,
        password: $scope.password
      }).then(function(authData) {
                    $scope.authData = authData;
                    console.log(authData.uid)
                    $window.location.href = 'profile/profile.html';
                }).catch(function(error) {
                   $scope.error = error;
                   switch (error.code) {
                        case "INVALID_EMAIL":
                            alert("The specified user account email is invalid.");
                            break;
                        case "INVALID_PASSWORD":
                            alert("The specified user account password is incorrect.");
                            break;
                        case "INVALID_USER":
                            alert("The specified user account does not exist.");
                            break;
                        default:
                            alert("Error logging user in:", error);
                    }
                });
            };
        }
    ]);

     //ProfileMod = angular.module("ProfileMod", ['firebase']);

 myApp.controller("ProfileCtrl",
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
