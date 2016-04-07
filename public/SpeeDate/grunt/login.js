	LoginMod = angular.module('LoginMod', ['firebase']);

    LoginMod.controller("LoginCtrl", ["$scope", "$firebaseAuth", "$window",
        function($scope, $firebaseAuth, $window) {
            var myFirebaseRef = new Firebase("https://burning-inferno-6071.firebaseio.com/");
            auth = $firebaseAuth(myFirebaseRef);
            $scope.login = function(email,password) {
            	console.log("checkcheck");
                auth.$authWithPassword({
        email: $scope.email,
        password: $scope.password
      }).then(function(authData) {
                    $scope.authData = authData;
                    console.log(authData)
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