
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

  /**
   * initApp handles setting up UI event listeners and registering Firebase auth listeners:
   *  - firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or
   *    out, and that is where we update the UI.
   */
   var amigos=[];
   var dat=[];
  function initApp() {
    // Listening for auth state changes.
    // [START authstatelistener]
    firebase.auth().onAuthStateChanged(function(user) {
      // [START_EXCLUDE silent]
      // [END_EXCLUDE]
      if (user) {

        
        var userId = firebase.auth().currentUser.uid;
        console.log(userId);
        const dbRefObject=firebase.database().ref().child('users');
        
        dbRefObject.on('value', snapshot => {
          dat=snapshot.val();
        });
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

  function addfriend(){
    var correo = document.getElementById('friend_name').value;
    var ds  = Object.keys(dat).map(function (key) { return dat[key]; });
    console.log(correo);
    
    for(var i=0; i< ds.length; i++){
      if (ds[i].email==correo) {
        added(ds[i].id);
        window.location='friends.html';
        return;
      }
      console.log(ds[i].email);
    }
    alert("No esta registrado ese correo");
    //window.location='friends.html';
  }

  function added(id){
    var userId = firebase.auth().currentUser.uid;
    firebase.database().ref('users/' + userId+'/friends/'+id).set({
      id : id
    });
    firebase.database().ref('users/' + id+'/friends/'+userId).set({
      id : userId
    });
    //window.location="groups.html?name="+geturl();
  }
  

  window.onload = function() {
    initApp();
  };
