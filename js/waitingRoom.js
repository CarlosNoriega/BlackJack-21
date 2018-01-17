
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
   var estado;
   var cantida;
  function initApp() {
    //geturl();
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
        const game=dbRefObject.child(geturl());
        game.on('value', snapshot => {
          var ds  = Object.keys(snapshot.val().integrantes).map(function (key) { return snapshot.val().integrantes[key]; });
          console.log(snapshot.val().integrantes);
          console.log(ds)
          estado=snapshot.val().estado;
          cantida=snapshot.val().cant;
          go();
          imprime(ds);
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
    for(var i=0; i < d.length; i++){
      s=s+'<button id="create_game" class="btn-large waves-effect waves-light  black" style="width:20%;">'+ d[i].name+'</button><br><br>';
    }
    document.getElementById('waiting').innerHTML=s;
  }



function go() {
    if(estado==1){
        window.location='https://unoboard.herokuapp.com/game.html?name='+geturl();
        console.log("entren todos")
    }else{
        console.log("no entra")
    }
    if(cantida==10){
        entra();
    }
}

function entra(){
    //console.log(l);
    if(cantida>1){
        var userId = firebase.auth().currentUser.uid;
        console.log(geturl())
        firebase.database().ref('games/' + geturl() ).update({
          estado : 1
        });
    }else{
        console.log("cantidad "+ cantida)
        alert("te faltan "+(1 - parseInt(cantida))+" jugadores papá ")
    }
  }

function geturl(){
    //var first = getUrlVars()["name"];
    //console.log(first);
   var query = location.search.substr(1);
   var result = {};
   query.split("&").forEach(function(part) {
   var item = part.split("=");
   result[item[0]] = decodeURIComponent(item[1]);
   });
   console.log(result.name);
   return result.name;
}
  

  window.onload = function() {
    initApp();
  };
