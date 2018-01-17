var config = {
    apiKey: "AIzaSyBhN1ahQIm8mA_27M6hJGgcPCeu26cPK3o",
    authDomain: "unoonline-4629d.firebaseapp.com",
    databaseURL: "https://unoonline-4629d.firebaseio.com",
    projectId: "unoonline-4629d",
    storageBucket: "unoonline-4629d.appspot.com",
    messagingSenderId: "815742422602"
  };
  firebase.initializeApp(config);
        
  var database = firebase.database();
  

function redireccionar(){
  window.location="index.html";
} 

function handleSignUp() {
      var email = document.getElementById('email').value;
      var password = document.getElementById('password').value;
      var name = document.getElementById('name').value;
      if (email.length < 4) {
        alert('Please enter an email address.');
        return;
      }
      if (password.length < 4) {
        alert('Please enter a password.');
        return;
      }
      // Sign in with email and pass.
      // [START createwithemail]
      firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
          user.updateProfile({
              displayName: name
          }).then(function() {
              // Update successful.
          }, function(error) {
              // An error happened.
          }); 

        var errorCode = error.code;
        var errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode == 'auth/weak-password') {
          alert('The password is too weak.');
        } else {
          alert(errorMessage);
        }
        console.log(error);
        // [END_EXCLUDE]
      });

      
      console.log(name);

      // [END createwithemail]
    }

function initApp() {
      // Listening for auth state changes.
      // [START authstatelistener]
      firebase.auth().onAuthStateChanged(function(user) {
        // [START_EXCLUDE silent]
        // [END_EXCLUDE]
        if (user) {
          // User is signed in.
          var displayName = user.displayName;
          var email = user.email;
          var emailVerified = user.emailVerified;
          var photoURL = user.photoURL;
          var isAnonymous = user.isAnonymous;
          var uid = user.uid;
          var providerData = user.providerData;
          changename();

          if (!emailVerified) {
          }
          // [END_EXCLUDE]
        } else {
          // [END_EXCLUDE]
        }

        // [END_EXCLUDE]
      });

    }

    window.onload = function() {
      initApp();
    };


function changename(){
  var userId = firebase.auth().currentUser.uid;
  var name = document.getElementById('name').value;
  var email  = document.getElementById('email').value;
  var country = document.getElementById('country').value;
  var favoriteBoardGame = document.getElementById('favorite').value;
    firebase.database().ref('users/' + userId).set({
      name : name,
      email : email,
      country : country,
      favoriteBoardGame : favoriteBoardGame,
      id : userId,
      score : 0
    });
    window.location='index.html';
  }

