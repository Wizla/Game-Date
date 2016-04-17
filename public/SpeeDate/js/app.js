
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
          //we check if oure user is authenticated with the client
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
  }

$scope.questionAdd = function(){
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

 //myApp.controller("QuestionCtrl",
  //function($scope){
    // var myFirebaseRef = new Firebase("https://burning-inferno-6071.firebaseio.com/profile");
          //we check if oure user is authenticated with the client
       //   var authData = myFirebaseRef.getAuth();
       //   console.log(authData);
        //Here we use the UID and set is as a child in the data tree, so it's unique for all users.
    //  var ref = new Firebase("https://burning-inferno-6071.firebaseio.com/profile/" + authData.uid + "/User"); 
        //We use the on methode to listen for data changes at the profile location
        //the callback passes us the data in the complete and we palce it in a scope object
        //we will use this scope object to place the data in the view
     // ref.on("value", function(Complete) {
     // var newData = Complete.val();
     // $scope.newData = newData;
     // console.log(newData.User);
  //});

  //});


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
       //Queue testing
       //Work in progress lol
       console.log($scope.newData.Questions.Questions.Question1.Workout); 
        // create an instance of a queue
        // note that the first argument - a callback to be used on each item - is required
/*        var myQueue = $queue.queue(myCallback, options);
        //possisble to queue a users uid
        myQueue.add(authData.uid);
        var size = myQueue.size();
        console.log(size); //add one item
        if (myQueue.size() >= 1) {
          myQueue.start();
          console.log("oke?");
          console.log($scope.items);
          if ($scope.items == authData.uid) {
            console.log($scope.newData);          
            ref.child('Chat').child("room" + profilescore).child("Users").child(authData.uid).child('Username').set({"Username" : { "Username" : $scope.newData.Users.User.username.Username}});
            console.log("it works ?");
          }
           //must call start() if queue starts paused
        }*/
        //myQueue.addEach(['item 2', 'item 3']); //add multiple items

        //myQueue.start(); //must call start() if queue starts paused
        //placing people with same score in the queue
        //check if there are 2 peeps in it, first one creates private room, second joins the room. Delete them from the queue
    //ref.child('Chat').child("room" + profilescore).child("Users").child(authData.uid).set($scope.newData.Users.User.username.Username);
    roomChatSetup(authData);
    initChat(authData);
       }, function(error) {
       // The callback failed.
        console.error(error);
      });

      // $scope.newData = Complete.val();
      // console.log(Complete);
      // console.log($scope.newData.Users.User.username)
      // console.log(1 + $scope.count++);

      // Provide a context to override "this" when callbacks are triggered.
// ref.once('value', function (dataSnapshot) {
//   // this.x is 1
//   console.log(dataSnapshot);
// }, 
// {x: 1});

      //$scope.what = newData;
      //console.log($scope.what);

      $scope.logout = function(){
        var myFirebaseRef = new Firebase("https://burning-inferno-6071.firebaseio.com/profile");
        myFirebaseRef.unauth();
        $window.location.href = 'index.html';
      }
  }]);

  myApp.controller("MatchCtrl", function($scope,$window){
    var profilescore = 0;
    var MyFirebase = new Firebase("https://burning-inferno-6071.firebaseio.com/");
    var authData = MyFirebase.getAuth();
        function roomChatSetup(authData) {
        var chat = new Firechat(MyFirebase);
        chat.setUser(authData.uid, $scope.newData.Users.User.username.Username, function(user) {
          console.log("Creating chatroom...");
          chat.createRoom("New Chatroom Name", "private", function(roomId) {
            console.log("Created room "+ roomId);
          });
       //$("#firechat").html("<div class='alert alert-success'>Your chatroom has been set up. Refresh to view</div>");
       });
     }

        function initChat(authData) {
        var chatUI = new FirechatUI(MyFirebase, document.getElementById('firechat'));
        chatUI.setUser(authData.uid, $scope.newData.Users.User.username.Username);
    }


    function getroomID(){
      MyFirebase.child('users').on("value", function(roomnr){
        roomnr.forEach(function(roomid){
          roomid.forEach(function(roomy){
            roomy.forEach(function(room){
              $scope.room = room.val();
              //console.log($scope.room.id);
              var room = JSON.stringify($scope.room.id)
              console.log(room);
              var chat = new Firechat(MyFirebase);
      chat.enterRoom(room);
      console.log('joining room...')

            })
          })
        })
      })
    }

        $scope.logout = function(){
        var myFirebaseRef = new Firebase("https://burning-inferno-6071.firebaseio.com/profile");
        myFirebaseRef.unauth();
        $window.location.href = 'index.html';
      }



    if (authData) {
      console.log("Successfully authenticated");
      console.log(authData);
       var profileref = MyFirebase.child("profile").child(authData.uid);
       var Matchref = MyFirebase.child('LookingFor');
       profileref.on("value",function(snapshot) {
        console.log(snapshot);
       $scope.newData = snapshot.val();
       if ($scope.newData.Users.User.LookingFor.LookingFor == "Female") {
        console.log($scope.newData.Users.User.username.Username);
        MyFirebase.child('LookingFor').child('Female').push({"Info" : {"Username" : $scope.newData.Users.User.username.Username,
                                                                                          "Sex" : $scope.newData.Users.User.Sex.Sex,
                                                                                           "UserID" : authData.uid}});
       Matchref.child('Male').limitToFirst(1).on("value", function(MatchData){
       MatchData.forEach(function(Snappyshot){
        $scope.key = Snappyshot.val();
        console.log($scope.key.Info.UserID);

           MyFirebase.child("profile").child($scope.key.Info.UserID).on("value", function(SnappyData){
          $scope.MatchUserData = SnappyData.val();
          console.log($scope.MatchUserData.Questions.Questions.Question1.Workout);
          console.log($scope.newData.Questions.Questions.Question1.Workout);
          //not really proud off the if block here.. But atm no idea how i should do this in a better way.. Leaving it like this for now.
        if($scope.newData.Questions.Questions.Question1.Workout == $scope.MatchUserData.Questions.Questions.Question1.Workout){
        profilescore += 1;
        console.log(profilescore);
       }
       if($scope.newData.Questions.Questions.Question2.Music == $scope.MatchUserData.Questions.Questions.Question2.Music){
        profilescore += 1;
        console.log(profilescore);
       }
        if($scope.newData.Questions.Questions.Question3.Festival == $scope.MatchUserData.Questions.Questions.Question3.Festival){
        profilescore += 1;
        console.log(profilescore);
       }
        if($scope.newData.Questions.Questions.Question4.Animals == $scope.MatchUserData.Questions.Questions.Question4.Animals){
        profilescore += 1;
        console.log(profilescore);
       }
        if($scope.newData.Questions.Questions.Question5.Adventures == $scope.MatchUserData.Questions.Questions.Question5.Adventures){
        profilescore += 1;
        console.log(profilescore);
       }
        if($scope.newData.Questions.Questions.Question6.Experiment == $scope.MatchUserData.Questions.Questions.Question6.Experiment){
        profilescore += 1;
        console.log(profilescore);
       }
        if($scope.newData.Questions.Questions.Question7.Cultural == $scope.MatchUserData.Questions.Questions.Question7.Cultural){
        profilescore += 1;
        console.log(profilescore);
       }
        if($scope.newData.Questions.Questions.Question8.Travel == $scope.MatchUserData.Questions.Questions.Question8.Travel){
        profilescore += 1;
        console.log(profilescore);
       }
        if($scope.newData.Questions.Questions.Question9.Films == $scope.MatchUserData.Questions.Questions.Question9.Films){
        profilescore += 1;
        console.log(profilescore);
       }
         if($scope.newData.Questions.Questions.Question10.Series == $scope.MatchUserData.Questions.Questions.Question10.Series){
        profilescore += 1;
        console.log(profilescore);
       }
        if($scope.newData.Questions.Questions.Question11.Games == $scope.MatchUserData.Questions.Questions.Question11.Games){
        profilescore += 1;
        console.log(profilescore);
       }
        if($scope.newData.Questions.Questions.Question12.Books == $scope.MatchUserData.Questions.Questions.Question12.Books){
        profilescore += 1;
        console.log(profilescore);
       }

       if (profilescore == 12) {
         roomChatSetup(authData);
         initChat(authData);
         getroomID();

       }

        });
      });

    });
       }

       if ($scope.newData.Users.User.LookingFor.LookingFor == "Male") {
        console.log($scope.newData.Users.User.username.Username);
        MyFirebase.child('LookingFor').child('Male').push({"Info" : {"Username" : $scope.newData.Users.User.username.Username,
                                                                                        "Sex" : $scope.newData.Users.User.Sex.Sex,
                                                                                         "UserID" : authData.uid}});
      Matchref.child('Female').limitToFirst(1).on("value", function(MatchData){
       MatchData.forEach(function(Snappyshot){
        $scope.key = Snappyshot.val();
        console.log($scope.key.Info.UserID);

        MyFirebase.child("profile").child($scope.key.Info.UserID).on("value", function(SnappyData){
          $scope.MatchUserData = SnappyData.val();
          console.log($scope.MatchUserData);
          if($scope.newData.Questions.Questions.Question1.Workout == $scope.MatchUserData.Questions.Questions.Question1.Workout){
        profilescore += 1;
        console.log(profilescore);
       }
       if($scope.newData.Questions.Questions.Question2.Music == $scope.MatchUserData.Questions.Questions.Question2.Music){
        profilescore += 1;
        console.log(profilescore);
       }
        if($scope.newData.Questions.Questions.Question3.Festival == $scope.MatchUserData.Questions.Questions.Question3.Festival){
        profilescore += 1;
        console.log(profilescore);
       }
        if($scope.newData.Questions.Questions.Question4.Animals == $scope.MatchUserData.Questions.Questions.Question4.Animals){
        profilescore += 1;
        console.log(profilescore);
       }
        if($scope.newData.Questions.Questions.Question5.Adventures == $scope.MatchUserData.Questions.Questions.Question5.Adventures){
        profilescore += 1;
        console.log(profilescore);
       }
        if($scope.newData.Questions.Questions.Question6.Experiment == $scope.MatchUserData.Questions.Questions.Question6.Experiment){
        profilescore += 1;
        console.log(profilescore);
       }
        if($scope.newData.Questions.Questions.Question7.Cultural == $scope.MatchUserData.Questions.Questions.Question7.Cultural){
        profilescore += 1;
        console.log(profilescore);
       }
        if($scope.newData.Questions.Questions.Question8.Travel == $scope.MatchUserData.Questions.Questions.Question8.Travel){
        profilescore += 1;
        console.log(profilescore);
       }
        if($scope.newData.Questions.Questions.Question9.Films == $scope.MatchUserData.Questions.Questions.Question9.Films){
        profilescore += 1;
        console.log(profilescore);
       }
         if($scope.newData.Questions.Questions.Question10.Series == $scope.MatchUserData.Questions.Questions.Question10.Series){
        profilescore += 1;
        console.log(profilescore);
       }
        if($scope.newData.Questions.Questions.Question11.Games == $scope.MatchUserData.Questions.Questions.Question11.Games){
        profilescore += 1;
        console.log(profilescore);
       }
        if($scope.newData.Questions.Questions.Question12.Books == $scope.MatchUserData.Questions.Questions.Question12.Books){
        profilescore += 1;
        console.log(profilescore);
       }
       if (profilescore == 12) {
        joinRoom(authData);
        initChat(authData);
       }
        });
      });

       });
       }
     });
    }
  });

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


