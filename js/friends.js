
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
          if(snapshot.val().friends!=null){
            amigos=Object.keys(snapshot.val().friends).map(function (key) { return snapshot.val().friends[key]; });
          }else{
            amigos=null;
          }
          console.log(amigos);
        });
        dbRefObject.on('value', snapshot => {
          dat=snapshot.val();
          am();
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

  function am(){ //recupera nombre y id de los amigos.
    console.log("score");
    console.log(Object.keys(dat).length);
    if(amigos!=null){
      var ds  = Object.keys(dat).map(function (key) { return dat[key]; });
      //console.log(ds);
      console.log(dat[amigos[0]]);
      var n=0;
      var datos=[];
      datos[0]=[];
      datos[1]=[];
      for(var i=0; i < amigos.length; i++){
        datos[0].push(dat[amigos[i].id].name);
        datos[1].push(dat[amigos[i].id].id);
      }
    }else{
      var datos=[];
      datos[0]=[];
      datos[1]=[];
      datos[0].push('you do not have friends');
      datos[1].push('');
    }
    console.log(datos);
    imprime(datos);
    
  }

    function imprime(d){
    var s="";
    for(var i=0; i < d[0].length; i++){
      if(d[1][i]!=''){
        var p="'"+d[1][i]+"'";
        s=s+'<tr><td class="friends_name">'+ d[0][i]+'</td> <td><i class="material-icons" onclick="del('+ p +')">delete</i></td></tr>';
      }else{
        s=s+'<tr><td class="friends_name">'+ d[0][i]+'</td></tr>';
      }
    }
    document.getElementById('friends').innerHTML=s;
    console.log(s);
  }
  
  function del(id){
    if (confirm("Are you sure to delete your friend? ") == true) {
        var userId = firebase.auth().currentUser.uid;
        firebase.database().ref('users/' + userId+'/friends/'+id).set(
          null
        );
        firebase.database().ref('users/' + id+'/friends/'+userId).set(
          null
        );
        console.log("Borrado");
    } else {
        console.log("cobarde");
    }
  }

  

  window.onload = function() {
    initApp();
  };
