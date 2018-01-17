
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
        const dbRefObject=firebase.database().ref().child('users');
        const us=dbRefObject.child(userId);
        us.on('value', snapshot => {
          console.log(snapshot.val().name);
          
          amigos=Object.keys(snapshot.val().friends).map(function (key) { return snapshot.val().friends[key]; });
          console.log(amigos);
        });
        dbRefObject.on('value', snapshot => {
          dat=snapshot.val();
          scoreGlobal();
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

  function scoreByCountry(pais){
    console.log("score");
    console.log(Object.keys(dat).length);
    var ds  = Object.keys(dat).map(function (key) { return dat[key]; });
    //console.log(ds);
    var n=0;
    var datos=[];
    datos[0]=[];
    datos[1]=[];
    for(var i=0; i < ds.length; i++){
      if (ds[i].country == pais) {
        datos[0].push(ds[i].name);
        datos[1].push(ds[i].score);
        n++;
        
      }
    }
    console.log(datos);
    imprime(datos,pais);
    return datos;
  }

  function scoreFriends(){
    console.log("score");
    console.log(Object.keys(dat).length);
    var ds  = Object.keys(dat).map(function (key) { return dat[key]; });
    //console.log(ds);
    console.log(dat[amigos[0]]);
    var n=0;
    var datos=[];
    datos[0]=[];
    datos[1]=[];
    for(var i=0; i < amigos.length; i++){
      datos[0].push(dat[amigos[i].id].name);
      datos[1].push(dat[amigos[i].id].score);
    }
    console.log(datos);
    imprime(datos,"");
    return datos;
  }

  function scoreGlobal(){
    console.log("score Global");
    //console.log(Object.keys(dat).length);
    var ds  = Object.keys(dat).map(function (key) { return dat[key]; });
    console.log(ds);
    var n=0;
    var datos=[];
    datos[0]=[];
    datos[1]=[];
    for(var i=0; i < ds.length; i++){
      datos[0].push(ds[i].name);
      datos[1].push(ds[i].score);

    }
    console.log(datos);
    imprime(datos,"");
  }
  
  function imprime(d,st){
    d=acomodo(d);
    var s="";
    if(st!=""){
      s='<div class="white-text">'+ st + ' </div>';
    }
    for(var i=0; i < d[0].length; i++){
      //console.log("name "+d[0][i]+" score: "+d[1][i]);
      s=s+'<h5 class="white-text">' +d[0][i] +': ' +d[1][i] +'</h5> <br>';
    }
    document.getElementById('players').innerHTML=s;
  }

  function cambio(v){
    console.log("cambio");
    console.log(v);
    scoreByCountry(v);
  }
  
  function acomodo(s){
    console.log(s);
    var o = [];
    for(var i=0; i<s[0].length;i++){
      o[i]={name: s[0][i], score: parseInt(s[1][i])}
    }
    o.sort(function(a, b){return b.score - a.score});
    var oo=[];
    oo[0]=[];
    oo[1]=[];
    for(var i=0; i<s[0].length;i++){
      oo[0][i]=o[i].name;
      oo[1][i]=o[i].score;
    }
    console.log(oo);
    return oo;
  }
  

  

  window.onload = function() {
    initApp();
  };
