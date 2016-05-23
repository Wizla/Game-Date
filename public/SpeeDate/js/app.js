
//Module for weppAPP 
var myApp = angular.module('myApp', ["firebase","ngQueue"]);

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
      var authData = myFirebaseRef.getAuth();
      if ($scope.password == $scope.cpassword) {      
      //methode for creation users, 2 scope objects --> binding with the register.html model.
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
                  var ref = new Firebase("https://burning-inferno-6071.firebaseio.com/profile/" + authData.uid); 
                  //We use the on methode to listen for data changes at the profile location
                  //the callback passes us the data in the complete and we palce it in a scope object
                  //we will use this scope object to place the data in the view
                  ref.once("value", function(Complete) {
                  var newData = Complete.val();
                  $scope.authData = authData;
                  console.log(authData.uid);
                  var newData = Complete.val();
                  $scope.newData = newData; 
                  if(newData != null){
                    $window.location.href = 'home.html';
                    console.log("!null");
                  }
                  if(newData == null){
                    $window.location.href = 'infoPage.html';
                    console.log("null");
                  }
                  });                    
              }
            });
          };
        $scope.loginF = function(){
          myFirebaseRef.authWithOAuthPopup("facebook", function(error, authData) {
            if (error) {
            alert("Login Failed!"+error);
            } else {
                    $scope.authData = authData;
                    console.log(authData.uid)
                    $window.location.href = 'infoPage.html';
            }
          });
        }
        }
    ]);


//profile conntroler the personal info
 myApp.controller("ProfileCtrl",["$scope","$window",
  function($scope,$window) {
    //here we reference to the profile in the root tree
   var myFirebaseRef = new Firebase("https://burning-inferno-6071.firebaseio.com/profile");
   var firebaseRef = new Firebase("https://burning-inferno-6071.firebaseio.com");
   var authData = myFirebaseRef.getAuth();
    $scope.Choices = [
    {Sex : "Female"},
    {Sex : "Male"}
    ];
    console.log($scope.SelectedSex);
    console.log($scope.LookingFor);
  //Here we use the UID and set is as a child in the data tree, so it's unique for all users.
  $scope.addProfile = function(){   
  myFirebaseRef.child(authData.uid).set({
                                         'Users' : { "User" : {
                                                    "Name" :  {
                                                      'First' : $scope.name, 
                                                      'Lastname' : $scope.lastname                                                
                                                    },
                                                    "Sex" : {"Sex" : $scope.SelectedSex.Sex
                                                    },
                                                    "LookingFor" : {"LookingFor" : $scope.LookingFor.Sex
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
                                                    }                                                
                                              })
    console.log($scope.SelectedSex.Sex);
    console.log($scope.LookingFor.Sex);
    
    if($scope.LookingFor.Sex == "Female"){
        firebaseRef.child("LookingFor").child('Female').child(authData.uid).set({"Info" : {"Username" : $scope.username,
                                                                                          "Sex" : $scope.SelectedSex.Sex,
                                                                                          "UserID" : authData.uid}})
    }
    if ($scope.LookingFor.Sex == "Male") {
      firebaseRef.child("LookingFor").child('Female').child(authData.uid).set({"Info" : {"Username" : $scope.username,
                                                                                          "Sex" : $scope.SelectedSex.Sex,
                                                                                          "UserID" : authData.uid}})
    }
  }

$scope.questionAdd = function(){
// Progressbar attempt 
//   setValue = 0;
//   if(document.getElementById('optionRadio1').checked) {
//     setValue += 8.34;
//     console.log("oke?");
// }

//  $('.progress-bar').each(function() {
//     var $bar = $(this);
//     var progress = setInterval(function() {
      
//       var currWidth = parseInt($bar.attr('aria-valuenow'));
//       var maxWidth = parseInt($bar.attr('aria-valuemax'));
//     //update the progress
//         $bar.width(currWidth+'%');
//         $bar.attr('aria-valuenow',currWidth+setValue);
//          console.log(currWidth + setValue);
//       //clear timer when max is reach
//       if (currWidth < (maxWidth) ){
//         clearInterval(progress);
//       }
//       else if(currWidth >= 100)
//         clearInterval(progress);         
//     }, 500);
  
// });

  console.log($scope.radioValue1);
  console.log($scope.radioValue2);
  console.log($scope.radioValue3);
  console.log($scope.radioValue4);
  console.log($scope.radioValue5);
  console.log($scope.radioValue6);
  console.log($scope.radioValue7);
  console.log($scope.radioValue8);
  console.log($scope.radioValue9);
  console.log($scope.radioValue10);
  console.log($scope.radioValue11);
  console.log($scope.radioValue12);
  myFirebaseRef.child(authData.uid).child('Questions').set({
                                         'Questions' : {
                                                        "Question1" : {"Workout" : $scope.radioValue1},
                                                        "Question2" : {"Music" : $scope.radioValue2},
                                                        "Question3" : {"Festival" : $scope.radioValue3},
                                                        "Question4" : {"Animals" : $scope.radioValue4},
                                                        "Question5" : {"Adventures" : $scope.radioValue5},
                                                        "Question6" : {"Experiment" : $scope.radioValue6},
                                                        "Question7" : {"Cultural" : $scope.radioValue7},
                                                        "Question8" : {"Travel" : $scope.radioValue8},
                                                        "Question9" : {"Films" : $scope.radioValue9},
                                                        "Question10" : {"Series" : $scope.radioValue10},
                                                        "Question11" : {"Games" : $scope.radioValue11},
                                                        "Question12" : {"Books" : $scope.radioValue12}                                                                                                                          }
  })
}
$scope.radioValue1 = "";
$scope.radioValue2 = "";
$scope.radioValue3 = "";
$scope.radioValue4 = "";
$scope.radioValue5 = "";
$scope.radioValue6 = "";
$scope.radioValue7 = "";
$scope.radioValue8 = "";
$scope.radioValue9 = "";
$scope.radioValue10 = "";
$scope.radioValue11 = "";
$scope.radioValue12 = "";

    
  
 }]);



 //Controller to retrive the data from the database
 myApp.controller("DetailCtrl", ['$scope','$queue',"$window",
  function($scope,$queue,$window) {  	   
        //Again we check for Auth data from the user, we use this UID again to get the unqie profile information from the specific user
        var myFirebaseRef = new Firebase("https://burning-inferno-6071.firebaseio.com/profile");    
        var authData = myFirebaseRef.getAuth();

        //We add this to oure firebase ref        
        var ref = new Firebase("https://burning-inferno-6071.firebaseio.com"); 
        //We use the on methode to listen for data changes at the profile location
        //the callback passes us the data in the complete and we palce it in a scope object    
       //we will use this scope object to place the data in the view
       var profilescore = 0;
       // create a new queue calkback
                /*var myCallback = function(item) {
                $scope.items = item
                //console.log(item);
                //console.log(items);

            },
            options = {
                delay: 2000, //delay 2 seconds between processing items
                paused: true, //start out paused
                complete: function() { console.log('complete!'); }
            };*/
        function roomChatSetup(authData) {
        var chat = new Firechat(ref);
        chat.setUser(authData.uid, $scope.newData.Users.User.username.Username, function(user) {
          console.log("Creating chatroom...");
          chat.createRoom("New Chatroom Name", "private", function(roomId) {
            console.log("Created room "+roomId);
          });
       
       });
     }

        function initChat(authData) {
        var chatUI = new FirechatUI(ref, document.getElementById('firechat'));
        chatUI.setUser(authData.uid, $scope.newData.Users.User.username.Username);
    }


       console.log(ref);
       var profileref = ref.child("profile").child(authData.uid);
       profileref.on("value",function(snapshot) {
        console.log(snapshot);
       $scope.newData = snapshot.val();
       console.log($scope.newData);
       $scope.$apply();

       console.log($scope.newData.Questions.Questions.Question1.Workout); 

    roomChatSetup(authData);
    initChat(authData);
       }, function(error) {
       // The callback failed.
        console.error(error);
      });

      $scope.logout = function(){
        var myFirebaseRef = new Firebase("https://burning-inferno-6071.firebaseio.com");
        myFirebaseRef.unauth();
        $window.location.href = 'index.html';
      }
  }]);
    //MAtching and chatting controller
     myApp.controller("MatchCtrl", function($scope,$window,$element,$attrs){
      //Firebase Referene
      var firebaseRef = new Firebase("https://burning-inferno-6071.firebaseio.com");
      //Authenticating the user
      var authData = firebaseRef.getAuth();

      //Function for RooomID
      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
      }
      function generateGUID(){
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
      }
      $scope.RoomID = generateGUID();
      //check if user is connecte
      if (authData) {
        //Firebase reference
         var Matchref = firebaseRef.child('LookingFor');
         //getting user authenticated user data 
         firebaseRef.child('profile').child(authData.uid).on("value", function(snapshot){
         $scope.newData = snapshot.val();
          var RoomRef = firebaseRef.child("Chatroom").child($scope.RoomID);              
          console.log($scope.newData);
          console.log("Looking for : " + $scope.newData.Users.User.LookingFor.LookingFor);
          //Looking for female 
          if ($scope.newData.Users.User.LookingFor.LookingFor == "Female") {
            //Retrieving last member added to lookingfor male section
            Matchref.child("Male").limitToLast(1).on("value", function(snapdata){
              snapdata.forEach(function(uid){
                $scope.uid = uid.val();
                //The user ID of the matched user
                console.log($scope.uid.Info.UserID);
                //retrieving data matched user
                firebaseRef.child("profile").child($scope.uid.Info.UserID).on("value", function(data){
                  //data is the matching user
                  //console.log($scope.newData); 
                  $scope.data = data.val();
                    //Make Chatroom adding 2 matched users in the room
                    RoomRef.set({"Users" : { 
                                              "User1" : $scope.data.Users.User.username.Username,
                                              "User2" : $scope.newData.Users.User.username.Username}})

                    $scope.sendMessage = function(){
                      //Save the Messages per username
                      RoomRef.child($scope.newData.Users.User.username.Username).child("Messages").push({"Messages": $scope.Messages});
                    
                   }
                    //Retrieving messages from the database
                    RoomRef.child("Messages").limitToLast(1).on('value', function(chatMessage){
                    $scope.chatMessage = chatMessage.val();
                    chatMessage.forEach(function(Message){
                       $scope.Message = Message.val();
                       console.log($scope.Message);
                       //Message to view
                       var newLine = document.createElement('p');
                       newLine.textContent = $scope.newData.Users.User.username.Username + ": " + $scope.Message.Messages;
                       document.getElementById("chatdiv").appendChild(newLine);
                    });
                   });             
                });
              });
            });
          }
          else
            //Do something whenere are are no males in the lookingfor section
          if ($scope.newData.Users.User.LookingFor.LookingFor == "Male") {
            Matchref.child('Male').child(authData.uid).set({"Info" : {"Username" : $scope.newData.Users.User.username.Username,
                                                                                          "Sex" : $scope.newData.Users.User.Sex.Sex,
                                                                                          "UserID" : authData.uid}})
              Matchref.child("Female").limitToLast(1).on("value", function(snapdata){
                snapdata.forEach(function(uid){
                  $scope.uid = uid.val();
                  console.log($scope.uid.Info.UserID);
                  firebaseRef.child("Chatroom").on("value", function(ChatID){
                    //$scope.ChatID = ChatID.key();
                    //console.log($scope.ChatID);
                    ChatID.forEach(function(ChatIDD){
                      $scope.ChatIDD = ChatIDD.key();
                      console.log($scope.ChatIDD);
                      firebaseRef.child("Chatroom").child($scope.ChatIDD).child("Messages").on("value", function(chatMessage){
                        $scope.chatMessage = chatMessage.val();
                        console.log($scope.chatMessage);
                        chatMessage.forEach(function(Message){
                          $scope.Message = Message.val();
                          console.log($scope.Message.Message);
                          var newLine = document.createElement('p');
                       newLine.textContent = $scope.newData.Users.User.username.Username + ": " + $scope.Message.Messages;
                       document.getElementById("chatdiv").appendChild(newLine);                        
                        });
                      });
                    });
                  });
                })
            });
          }         
        });
      }
     });

//<STRIPE>
jQuery(function($) {
  $('#payment-form').submit(function(event) {
    var $form = $(this);

    // Disable the submit button to prevent repeated clicks
    $form.find('button').prop('disabled', true);

    Stripe.card.createToken($form, stripeResponseHandler);

    // Prevent the form from submitting with the default action
    return false;
  });
});
function stripeResponseHandler(status, response) {
  var $form = $('#payment-form');

  if (response.error) {
    // Show the errors on the form
    $form.find('.payment-errors').text(response.error.message);
    $form.find('button').prop('disabled', false);
  } else {
    // response contains id and card, which contains additional card details
    var token = response.id;
    // Insert the token into the form so it gets submitted to the server
    $form.append($('<input type="hidden" name="stripeToken" />').val(token));
    // and submit
    $form.get(0).submit();
  }
};

jQuery(function($){
$('#payment-form').submit(function(event) {

    // Grab the form:
    var $form = $(this);

    // Disable the submit button to prevent repeated clicks:
    $('#submit').prop('disabled', true);

    // Request a token from Stripe:
    Stripe.card.createToken($form, stripeResponseHandler);

    // Prevent the form from being submitted:
    return false;
  });
});

//</STRIPE>

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



     //  for (var key in $scope.newData.Questions.Questions) {
     //  if ($scope.newData.Questions.Questions.hasOwnProperty(key)) {
     //   console.log(key + " -> " + JSON.stringify($scope.newData.Questions.Questions[key]));
     //   if ((JSON.stringify($scope.newData.Questions.Questions.Question1.Workout)) == "Yes") {
     //    console.log('lol');
     //   }
     //   }
     // }


