
// Initialize Firebase
var config = {
    apiKey: "AIzaSyBhN1ahQIm8mA_27M6hJGgcPCeu26cPK3o",
    authDomain: "unoonline-4629d.firebaseapp.com",
    databaseURL: "https://unoonline-4629d.firebaseio.com",
    projectId: "unoonline-4629d",
    storageBucket: "unoonline-4629d.appspot.com",
    messagingSenderId: "815742422602"
  };
  firebase.initializeApp(config);


   var amigos=[];
   var dat=[];
   var name;
  function initApp() {
    // Listening for auth state changes.
    // [START authstatelistener]
    firebase.auth().onAuthStateChanged(function(user) {
      // [START_EXCLUDE silent]
      // [END_EXCLUDE]
      if (user) {

        var displayName = user.displayName;
        var email = user.email;
        var emailVerified = user.emailVerified;
        var photoURL = user.photoURL;
        var isAnonymous = user.isAnonymous;
        var uid = user.uid;
        var providerData = user.providerData;
        // [START_EXCLUDE silent]
        
        var userId = firebase.auth().currentUser.uid;
        console.log(userId);
        const dbRefObject=firebase.database().ref().child('games');
        dbRefObject.on('value', snapshot => {
          var ds  = Object.keys(snapshot.val()).map(function (key) { return snapshot.val()[key]; });
          console.log(ds);
          imprime(ds);
        });
        const us=firebase.database().ref().child('users');
        const useer=us.child(userId);
        useer.on('value', snapshot => {
          //var ds  = Object.keys(snapshot.val()).map(function (key) { return snapshot.val()[key]; });
          name=snapshot.val().name;
          console.log("names "+snapshot.val().name);
          //imprime(ds);
        });
        if (!emailVerified) {
        }
        // [END_EXCLUDE]
      } else {
        console.log("no usuario");
        window.location='index.html';
        // User is signed out.
        // [START_EXCLUDE silent]
        // [END_EXCLUDE]
      }
      // [START_EXCLUDE silent]
      // [END_EXCLUDE]
    });
    // [END authstatelistener]

  }

  
  
  function imprime(d){
    var s="";
    console.log(d);
    for(var i=0; i < d.length; i++){
      if(d[i].estado==0){
        var p="'"+d[i].name+d[i].id+"'";
        s=s+'<button id="create_game" class="btn-large waves-effect waves-light  black" style="width:20%;" onclick="entra('+ p +')">'+ d[i].name+'</button><br><br>';
      }
    }
    document.getElementById('buttons').innerHTML=s;
  }

  function entra(l){
    console.log(l);
    var userId = firebase.auth().currentUser.uid;
    
    const dbRefObject=firebase.database().ref().child('games');
    const game=dbRefObject.child(l);
    var sum=0;
    var turn=0;
    game.on('value', snapshot => {
      sum =snapshot.val().cant+1;
      turn=sum-1;
      console.log(snapshot.val().cant)
    });
    
    firebase.database().ref('games/' + l + "/integrantes/"+userId).set({
      id : userId,
      name : name,
      turn : turn,
      puntos : 0,
      pasar : 0,
      play : true
    });
    
    firebase.database().ref('games/' + l ).update({
      cant : sum
    });
    window.location="waitingRoom.html?name="+l;
  }

  

  window.onload = function() {
    initApp();
  };
