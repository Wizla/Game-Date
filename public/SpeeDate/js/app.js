
//Module for weppAPP 
var myApp = angular.module('myApp', ["firebase"]);

//myApp.factory("Auth", ["$firebaseAuth",
	//function($firebaseAuth) {
		//var myFirebaseRef = new Firebase("https://burning-inferno-6071.firebaseio.com/");
		//console.log("check");
		//return $firebaseAuth(myFirebaseRef);		
	//}
	//]);

//First controller for registering accounts..
//$scope Dependency injected, for use of 2 way binding.
myApp.controller("RegisterCtrl", ["$scope",
  function($scope) {
    //Function fired when pressed on button
    $scope.createUser = function() {
      //Firebase REF, Account will be created and stored in the database
      //Database is @ Login & Auth! Won't be abel to see password, only email and ID! Secure.
      var myFirebaseRef = new Firebase("https://burning-inferno-6071.firebaseio.com/");
      if ($scope.password == $scope.cpassword) {      
      //Firebase SDK methode for creation users, 2 scope objects --> binding with the register.html model.
      myFirebaseRef.createUser({
          email: $scope.email,
          password: $scope.password
          //following is a callback, whenever we recive a basic error we will show them to the user
      }, function(error, userData) {
          if (error) {
            switch (error.code) {
              case "EMAIL_TAKEN":
                alert("The new user account cannot be created because the email is already in use.");
                break;
              case "INVALID_EMAIL":
                alert("The specified email is not a valid email.");
                break;
              default:
                alert("Error creating user:", error);
            }
            //Whenever account is succesfully created! 
          } else {
            console.log("Successfully created user account with uid:", userData.uid);
            }
          })
     } else{
     	alert("Password Does not match");
     }
    };
  }
]);


    //login controller
    //Dependency injection //Window might be changed later on with UI router.. 
    myApp.controller("LoginCtrl", ["$scope","$window",
        function($scope,$window) {
          //firebase ref again, 
            var myFirebaseRef = new Firebase("https://burning-inferno-6071.firebaseio.com/");
            $scope.login = function(){
              myFirebaseRef.authWithPassword({
                "email": $scope.email,
                "password": $scope.password
                //Promise again, error and authdata, check console for more detail on this object, 
                //most import is the UID!, will be used later on to authenticate the user profile
            }, function(error, authData) {               
                  if(error) {
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
                } else {
                  //the window dependency will allow us to go to another html page
                    $scope.authData = authData;
                    console.log(authData.uid)
                    $window.location.href = 'infoPage.html';
              }
            });
          };
        }
    ]);

//profile conntroler the personal info
 myApp.controller("ProfileCtrl",
  function($scope) {
    //here we reference to the profile in the root tree
  var myFirebaseRef = new Firebase("https://burning-inferno-6071.firebaseio.com/profile");
          //we check if oure user is authenticated with the client
          var authData = myFirebaseRef.getAuth();
        //Here we use the UID and set is as a child in the data tree, so it's unique for all users.
  $scope.addProfile = function(){   
  myFirebaseRef.child(authData.uid).set({
                                         'User' : {  
                                                    "Name" :  {
                                                      'First' : $scope.name, 
                                                      'Lastname' : $scope.lastname                                                
                                                    },
                                                    'Age': {"day" : $scope.day,
                                                            "month" : $scope.month,
                                                            "year" : $scope.year
                                                    },
                                                    'username' : {'Username' : $scope.username
                                                    },                                              
                                                    'Place' : {
                                                      'City' :  $scope.city,
                                                      'Country' : $scope.country
                                                    },
                                                    'Job' : {"Job" : $scope.job},
                                                    'AboutMe' : {"AboutMe" : $scope.aboutme},                                                                                           
                                                    }                                                 
                                              })
  console.log("lol");
  }
  
 });

 myApp.controller("QuestionCtrl",
  function($scope){
     var myFirebaseRef = new Firebase("https://burning-inferno-6071.firebaseio.com/profile");
          //we check if oure user is authenticated with the client
          var authData = myFirebaseRef.getAuth();
          console.log(authData);
        //Here we use the UID and set is as a child in the data tree, so it's unique for all users.
            var ref = new Firebase("https://burning-inferno-6071.firebaseio.com/profile/" + authData.uid);
        ref.on("value", function(Complete) {
      var newData = Complete.val();
      $scope.newData = newData;
      console.log(newData);
  });
      $scope.questionAdd = function(){
        console.log(newData);
      myFirebaseRef.child(authData.uid).child(newData.User).set({
                                                           'Questions' : {
                                                                      "Question1" : {"Muziek" : "yes"}
                                                           }
        })
      }

  });


 //Controller to retrive the data from the database
 myApp.controller("DetailCtrl", ['$scope',
  function($scope) {
  	    //Again we check for Auth data from the user, we use this UID again to get the unqie profile information from the specific user
        var myFirebaseRef = new Firebase("https://burning-inferno-6071.firebaseio.com/profile");
        var authData = myFirebaseRef.getAuth();
        //We add this to oure firebase ref
        var ref = new Firebase("https://burning-inferno-6071.firebaseio.com/profile/" + authData.uid); 
        //We use the on methode to listen for data changes at the profile location
        //the callback passes us the data in the complete and we palce it in a scope object
        //we will use this scope object to place the data in the view
      ref.on("value", function(Complete) {
      var newData = Complete.val();
      $scope.newData = newData;
  });
  }]);


 		$(function() {

    $('#login-form-link').click(function(e) {
    $("#login-form").delay(100).fadeIn(100);
    $("#register-form").fadeOut(100);
    $('#register-form-link').removeClass('active');
    $(this).addClass('active');
    e.preventDefault();
  });
  $('#register-form-link').click(function(e) {
    $("#register-form").delay(100).fadeIn(100);
    $("#login-form").fadeOut(100);
    $('#login-form-link').removeClass('active');
    $(this).addClass('active');
    e.preventDefault();
  });

});

$(function() {

    $('#info-form-link').click(function(e) {
    $("#info-form").delay(100).fadeIn(100);
    $("#questions-form").fadeOut(100);
    $('#questions-form-link').removeClass('active');
    $(this).addClass('active');
    e.preventDefault();
  });
  $('#questions-form-link').click(function(e) {
    $("#questions-form").delay(100).fadeIn(100);
    $("#info-form").fadeOut(100);
    $('#info-form-link').removeClass('active');
    $(this).addClass('active');
    e.preventDefault();
  });

});

$(document).ready(function(){
  $.dobPicker({
    // Selectopr IDs
    daySelector: '#dobday',
    monthSelector: '#dobmonth',
    yearSelector: '#dobyear',
    // Default option values
    dayDefault: 'Day',
    monthDefault: 'Month',
    yearDefault: 'Year',
    // Minimum age
    minimumAge: 10,
    // Maximum age
    maximumAge: 80
  });
});


