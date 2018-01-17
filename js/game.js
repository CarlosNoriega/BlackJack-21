/*TODO: 
validation:
    check that player hands <= 21 otherwise block him
    if Someone gets a 21 game ends and players wins
    
    check how to validate "as"
    
    
    if (cardsInHand == 5 && points < 21  ) Player WINS, send correct notification to user
    
    
visual Feedback

*/

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


var suits = ["Spades", "Clubs", "Diamonds", "Hearts"];
var values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
var deck = new Array();
var players = new Array();
var turnNumber=0; //global turn in game
var numPlayers;
var indexForDeckInGame;
var initCanvas=true;
var myturn;
var myPoints;
var cardsInHand=0;
var firstTurnOfPlayer=true;
var numOfPass;
var gameHasWinner;
var isNotEnded= true;
var stealPlaying;

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
        var po=0;
        console.log(userId);
        const dbRefObject=firebase.database().ref().child('games');
         const game=dbRefObject.child(geturl());
        const inte=game.child("integrantes");
        const tu=inte.child(userId);
        tu.on('value', snapshot => {
          myturn=snapshot.val().turn;
          myPoints=snapshot.val().puntos;
          stealPlaying=snapshot.val().play;
          
          
        });
        game.on('value', snapshot => {
          var ds  = Object.keys(snapshot.val().integrantes).map(function (key) { return snapshot.val().integrantes[key]; });
          console.log(snapshot.val());
          console.log(ds)
          players=ds;
          numOfPass=snapshot.val().pasar;
          deck=snapshot.val().deck;
          gameHasWinner=snapshot.val().gano;
          checkForWinners(snapshot.val().gano);
          numPlayers=snapshot.val().cant;
          turnNumber=(snapshot.val().turn)%numPlayers;
          indexForDeckInGame=snapshot.val().indice;
          if(numOfPass>=numPlayers){
            firebase.database().ref('games/' + geturl() ).update({
                gano : 1
            });
          }
          
        
          if(isNotEnded)
            updatePlayerTurnsGUI(ds);
          
          if(initCanvas){
              startGameConstructor();
              initCanvas=false;
          }
          
          
        });
        
        const userss=firebase.database().ref().child('users');
        const us=userss.child(userId);
        us.on('value', snapshot => {
          //var ds  = Object.keys(snapshot.val().integrantes).map(function (key) { return snapshot.val().integrantes[key]; });
          //console.log(snapshot.val().integrantes);
          //console.log(ds)
          //turnNumber=snapshot.val().turn;
          //estado=snapshot.val().estado;
          //cantida=snapshot.val().cant;
          //go();
          //imprime(ds);
        });
        if (!emailVerified) {
        }
        // [END_EXCLUDE]
      } else {
        console.log("no usuario");
        window.location='https://uno-marysolsnz.c9users.io/index.html';
        // User is signed out.
        // [START_EXCLUDE silent]
        // [END_EXCLUDE]
      }
      // [START_EXCLUDE silent]
      // [END_EXCLUDE]
    });
    // [END authstatelistener]
    
  }

function checkForWinners(gamehaswinner) {
    if(gamehaswinner==1){
        finishGame();
    }
}


function start() {
    initApp(); //initializes instance of firebase
    document.getElementById('passButton').style.visibility='hidden';
}

function updatePlayerTurnsGUI(playerArrays){
    var s="";
    for(var i=0; i < playerArrays.length; i++){
      if(playerArrays[i].turn == turnNumber){
           s=s+'<p class="flow-text amber-text text-amber accent-3">'+playerArrays[i].name+'</p>';
      }else{
          s=s+'<p class="flow-text white-text">'+playerArrays[i].name+'</p>';
      }
    }
    if(myturn==turnNumber){
        if(stealPlaying){
            checkIfPointsAreValid(myPoints);
        }
        toggleButtonsVisibility(true);
    }else{
        toggleButtonsVisibility(false);
    }
    
    if(!stealPlaying){
        //pass();
    }
    
    document.getElementById('PlayersInGame').innerHTML=s;
}

function toggleButtonsVisibility(isMyturn){
    
    if(isMyturn){
        if(stealPlaying){
            document.getElementById('getCardButton').style.visibility='visible';
        }else{
            document.getElementById('getCardButton').style.visibility='hidden';
        }
        
        if(!firstTurnOfPlayer){
            document.getElementById('passButton').style.visibility='visible';
        }
    }
    else{
        document.getElementById('getCardButton').style.visibility='hidden';
        document.getElementById('passButton').style.visibility='hidden';
    }
}



//
function updateFBIndex(ind){
    console.log(deck);
    firebase.database().ref('games/' + geturl() ).update({
      indice : ind
    });
}

function updateFBPassCount(ind){
    //console.log(deck);
    firebase.database().ref('games/' + geturl() ).update({
      pasar : ind
    });
}

function updateFBTurn(ind){
    console.log(deck);
    
    firebase.database().ref('games/' + geturl() ).update({
      turn : ind
    });
    
    
}

function updateFBpoints(ind){
    var userId = firebase.auth().currentUser.uid;
    firebase.database().ref('games/' + geturl() + "/integrantes/" + userId).update({
      puntos : ind
    });
}

function updateNumberOfCards(ind){
    var userId = firebase.auth().currentUser.uid;
    firebase.database().ref('games/' + geturl() + "/integrantes/" + userId).update({
      puntos : ind
    });
}

//takeID for game
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

//this can be deleted in a future
function startDemo (){
   // dealHands();
}

//gives two cards to player in first turn
function dealHands() {
    
    playGame.prototype.initialDrawAnimation(indexForDeckInGame,0);
    for (var i = 0; i < 2; i++) {
        var card = deck[indexForDeckInGame];
        indexForDeckInGame--;
        updateFBIndex(indexForDeckInGame);
        var puntos=card.Card_val+myPoints;
        cardsInHand++;
        updateFBpoints(puntos);
        if(puntos==21 || (cardsInHand > 4 && puntos<22)){
                firebase.database().ref('games/' + geturl() ).update({
                    gano : 1
                });
            }
    }
    changeTurn();
}

//gives a card to user
function hit() {
    if(myturn==turnNumber){
        if(firstTurnOfPlayer){
            dealHands();
            firstTurnOfPlayer=false;
        }else{
            updateFBPassCount(0);
            var card = deck[indexForDeckInGame];
            playGame.prototype.getCardAnimationRemote(indexForDeckInGame, cardsInHand);
            indexForDeckInGame--;
            cardsInHand++;
            updateFBIndex(indexForDeckInGame);
            var puntos=card.Card_val+myPoints;
            console.log(card)
            updateFBpoints(puntos);
            if(puntos==21 || (cardsInHand > 4 && puntos<22) ){
                firebase.database().ref('games/' + geturl() ).update({
                    gano : 1
                });
            }
            
            changeTurn();
        }
    }
}

function exit(){
    if (confirm("Are you sure you whant to leave? ") == true) {
        firebase.database().ref('games/' + geturl() ).update({
            gano : 1
        });
    } else {
        console.log("cobarde");
    }
    
}


function pass(){
    
    firebase.database().ref('games/' + geturl() ).update({
      turn : turnNumber+1
    });
    firebase.database().ref('games/' + geturl() ).update({
      pasar : numOfPass+1
    });
}

function changeTurn(){
    if(myturn==turnNumber){
        updateFBTurn(turnNumber+1);
    }
}

function finishGame() {
    if(isNotEnded){
        var userId = firebase.auth().currentUser.uid;
        var winner = -1;
        var score = 0;
        var winwhit5=false;
        var youwin=false;
        for (var i = 0; i < players.length; i++) {
            if (players[i].puntos > score && players[i].puntos <= 21) {
                winner = i;
                score = players[i].puntos;
            }
            if(players[i].puntos<21 && cardsInHand>4 && players[i].id==userId){
                winner=i;
                winwhit5=true;
                score=players[i].puntos;
                youwin=true;
            }
        }
        
        if(winner==-1){
            updateFBScore(10);
            console.log("Todos pierden");
            alert("Nobody wins");
        }else{
            if(!winwhit5){
                for(var i = 0; i < players.length; i++){
                    if(players[i].puntos==players[winner].puntos && userId==players[i].id){
                        youwin=true;
                    }
                }
            }
            if(winwhit5){
                updateFBScore(50);
                console.log("Ganaste con msa de 5 cartas.");
                alert("You win whit "+players[winner].puntos+ " points and 5 cards.");
            }else{
                if(youwin){//ganaste
                    updateFBScore(50);
                    console.log("Ganaste con "+players[winner].puntos + " puntos.");
                    alert("You win whit "+players[winner].puntos+ " points.");
                }
                else{
                    updateFBScore(10);
                    console.log("Perdiste, ganó "+players[winner].name+" con "+players[winner].puntos + " puntos.");
                    alert("You lost, "+players[winner].name+" won whit "+players[winner].puntos + " points."); 
                }
            }
        }
        firebase.database().ref('games/' + geturl() ).update({
            gano : 1
        });
        isNotEnded=false;
        toggleButtonsVisibility(false);
        window.location='https://uno-marysolsnz.c9users.io/mainMenu.html';
    }
}

function updateFBScore(pointsToBeAdded){
    var userId = firebase.auth().currentUser.uid;
    const userss=firebase.database().ref().child('users');
    const us=userss.child(userId);
    us.on('value', snapshot => {
      pointsToBeAdded=snapshot.val().score+pointsToBeAdded;
    });
    
    var userId = firebase.auth().currentUser.uid;
    firebase.database().ref('users/' + userId ).update({
      score : pointsToBeAdded
    });
}

function updateStealPlaying(play) {
    var userId = firebase.auth().currentUser.uid;
    firebase.database().ref('games/' + geturl() + "/integrantes/" + userId).update({
      play : play
    });
}

function checkIfPointsAreValid(p) {
    console.log("Puntos ------------------"+p)
    if (p > 21) {
        console.log("salte--------------------------------------------------------")
       updateStealPlaying(false);
    }
}


