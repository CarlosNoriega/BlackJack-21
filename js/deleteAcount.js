var config = {
    apiKey: "AIzaSyBhN1ahQIm8mA_27M6hJGgcPCeu26cPK3o",
    authDomain: "unoonline-4629d.firebaseapp.com",
    databaseURL: "https://unoonline-4629d.firebaseio.com",
    projectId: "unoonline-4629d",
    storageBucket: "unoonline-4629d.appspot.com",
    messagingSenderId: "815742422602"
  };
  firebase.initializeApp(config);

function reauthenticateUser(){
    var user = firebase.auth().currentUser;
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    var credential = firebase.auth.EmailAuthProvider.credential(email, password);
    user.reauthenticate(credential).then(function() {
      console.log("si se pudo");
      deleteAcount();
    }, function(error) {
        alert("Verify your information");
    });
}

function deleteAcount(){
    if (confirm("Are you sure to delete your acount? ") == true) {
        var friends=[];
        var user = firebase.auth().currentUser;
        var userId = firebase.auth().currentUser.uid;
        const dbRefObject=firebase.database().ref().child('users');
        const us=dbRefObject.child(userId).child('friends');
        us.on('value', snapshot => {
          console.log(snapshot.val());
          if(snapshot.val()!=null){
              friends=Object.keys(snapshot.val()).map(function (key) { return snapshot.val()[key]; });
              console.log(friends[0].id);
              for(var i=0; i<friends.length;i++){
                    console.log('borrar a '+friends[i].id)
                    firebase.database().ref('users/' + friends[i].id+'/friends/'+userId).set(
                      null
                    );
                    firebase.database().ref('users/' + userId+'/friends/'+friends[i].id).set(
                      null
                    );
              }
          }
           
         firebase.database().ref('users/' + userId).set(
              null
            );
         console.log("Borrado"); 
        });
        user.delete().then(function() {
          alert('User deleted')
        }, function(error) {
          // An error happened.
        });
        console.log("borra");
        //window.location='index.html';
    }else{
        window.location='mainMenu.html';
    }
}


function initApp() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      
    } else {
      console.log("no usuario");
        window.location='index.html';
    }
  });

}

window.onload = function() {
  initApp();
};