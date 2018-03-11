$(document).ready(function(){

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyBOK2twpeuoZA2oeJBfiI-EOGaJrvI0ck4",
        authDomain: "fir-trainscheduler.firebaseapp.com",
        databaseURL: "https://fir-trainscheduler.firebaseio.com",
        projectId: "fir-trainscheduler",
        storageBucket: "fir-trainscheduler.appspot.com",
        messagingSenderId: "964966023007"
    };
  
  firebase.initializeApp(config);

  var database = firebase.database();


var trainInfo = {
  name: "",
  destination: "",
  firstTrain: "",
  frequency: 0,
  nextTrainMin: 0,
  nextTrainTime: 0
}

   var firstTrainConverted;
   var currentTime;
   var diffTime;
   var remainingTime;

// Displays the date and time on the screen

   setInterval(function(){
     $("#currentDAndT").text(moment().format('MMMM Do YYYY, hh:mm:ss a'));}
     ,1000);

  // on submit adds value to trainInfo obj properties
   $("#trainAddForm").on("submit", function (event) {
    event.preventDefault();
     console.log(trainInfo.nextTrainMin, "this works");
    trainInfo.name = $("#trainName").val().trim();
    trainInfo.destination = $("#trainDestination").val().trim();
    trainInfo.firstTrain = $("#firstTrainTime").val().trim();
    trainInfo.frequency = $("#trainFrequency").val().trim();
    
    firstTrainConverted = moment(trainInfo.firstTrain, "hh:mm").subtract(1, "years");
    
    currentTime = moment();
    
    diffTime = currentTime.diff(moment(firstTrainConverted), "minutes");
    
    remainingTime = diffTime % trainInfo.frequency;
    trainInfo.nextTrainMin = trainInfo.frequency - remainingTime;
    
    if (trainInfo.nextTrainTime < trainInfo.firstTrain) { //need to compare these two using unix time (if smaller then display first train time)
       trainInfo.nextTrainTime = trainInfo.firstTrain;
    } else {
      trainInfo.nextTrainTime = moment().add(trainInfo.nextTrainMin, "minutes").format("hh:mm");
    }
    
    

    database.ref().push(trainInfo);

     $('#trainAddForm :input').val('');
   });

   database.ref().on("child_added", function(childSnapshot, prevChildKey){

     trainInfo.name = childSnapshot.val().name;
     trainInfo.destination = childSnapshot.val().destination;
     trainInfo.firstTrain = childSnapshot.val().firstTrain;
     trainInfo.frequency = childSnapshot.val().frequency;
     trainInfo.nextTrainMin = childSnapshot.val().nextTrainMin;
     trainInfo.nextTrainTime = childSnapshot.val().nextTrainTime;
     
     $("#trainRows").append("<tr><td>" + trainInfo.name + "</td><td>" + trainInfo.destination + "</td><td>" +
       trainInfo.firstTrain + "</td><td>" + trainInfo.frequency + "</td><td>" + trainInfo.nextTrainTime + "</td><td>" + trainInfo.nextTrainMin + "</td></tr>");
   });
 });