
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

   var name;
  function initApp() {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        var userId = firebase.auth().currentUser.uid;
        console.log(userId);
        const dbRefObject=firebase.database().ref().child('users');
        const us=dbRefObject.child(userId);
        us.on('value', snapshot => {
          name=snapshot.val().name;
          console.log(name);
        });
        dbRefObject.on('value', snapshot => {
          dat=snapshot.val();
        });
      } else {
        console.log("no usuario");
        window.location='index.html';
      }
    });

  }



var suits = ["Spades", "Clubs", "Diamonds", "Hearts"];
var values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
var deck = new Array();


function createDeck() {
    deck = new Array();
    for (var i = 0; i < suits.length; i++) {
        for (var x = 0; x < values.length; x++) {
            var card_val = parseInt(values[x]);
            if (values[x] == "J" || values[x] == "Q" || values[x] == "K")
                card_val = 10;
            if (values[x] == "A")
                card_val = 11;
            var card = {
                Value: values[x],
                Suit: suits[i],
                Card_val: card_val,
                frame: (i*13) + x
            };
            console.log(card.frame);
            deck.push(card);

        }
    }
    console.log("Termine con las cartas");
    
    shuffle();

}

function shuffle() {
    for (var i = 0; i < 1000; i++) {
        var seed1 = Math.floor((Math.random() * deck.length));
        var seed2 = Math.floor((Math.random() * deck.length));
        var tmp = deck[seed1];

        deck[seed1] = deck[seed2];
        deck[seed2] = tmp;
    }
    
}


  function added(){
    createDeck();
    console.log("agrega "+name);
    var n = document.getElementById('game_name').value;
    var userId = firebase.auth().currentUser.uid;
    firebase.database().ref('games/' + n + userId).set({
      id : userId,
      admin : name,
      name : n,
      cant : 1,
      jugador : 1,
      estado : 0,
      indice : 51,
      turn : 0,
      deck : deck,
      gano : 0,
      pasar : 0
    });
    var userId = firebase.auth().currentUser.uid;
    firebase.database().ref('games/' + n+userId + "/integrantes/"+userId).set({
      id : userId,
      name : name,
      turn : 0,
      puntos : 0,
      pasar : 0,
      play : true
    });
    window.location="waitingRoom.html?name="+n+userId;
  }
  
  

  window.onload = function() {
    initApp();
  };
