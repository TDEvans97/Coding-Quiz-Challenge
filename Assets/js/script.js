//Game Settings - These variables will not change
const timePerQuestion = 10; //Seconds
const wrongAnswerPenalty = 10; //Seconds
const rightAnswerReward = 10; //Points
const storageName = "Player Results";
const maxNumberOfHighScores = 10;
const questions = [
  {
    q: "1 + 1 = ?",
    a: [
      "2", "3", "1", "0"
    ]
  },
  {
    q: "2 + 2 = ?",
    a: [
      "1", "2", "3", "4"
    ]
  }
];

// Global let Variables  -  these are expected to be reassigned but not redeclared
let score = 0;
let currentQuestionIndexNumber = 0;
let timeRemaining;
let timer;
let initials = "";

// Put things inside the HTML to display on the page.
var mainEl = $("main");
var titleEl = $("<p>");
titleEl.text("Welcome player! Challenge your coding knowledge by answering all the questions before the timer runs out. Correct answers will earn you 10 points each. Incorrect answers will earn you 0 points and remove 10 seconds from your timer. When the timer runs out or all questions are answered, the game is over. If you are satisfied with your highscore, you may post your initials and total points to the scoreboard.");
mainEl.append(titleEl);
var footerEl = $("footer");

//wait for all HTML to load
document.addEventListener("DOMContentLoaded", init);

function init() {
document.querySelector(".startGameBtn").addEventListener("click", startGame);
showHighScores(); 
}

//Run this when the start game button is clicked.
function startGame() {
  //Reset the score to zero
  score = 0;
  //Start on the first question
  currentQuestionIndexNumber = 0;
  //Start the timer countdown
  startTimer();
  //Load the question
  loadQuestion();
}

function startTimer() {
  // Calculate the starting time based on the number of objects in the questions array.
  timeRemaining = timePerQuestion * questions.length; //timePerQuestion is 10 seconds
  tick(); //Because we called tick before the timer, it will start on the timeRemaining before counting down
  timer = setInterval(tick, 1000); // Created a variable to call later inside the clearInterval of function endTimer.
}

//Run these commands on each question loaded.
function loadQuestion() {
  titleEl.text = ""; 
  let currentQuestion = questions[currentQuestionIndexNumber]; // When questions[0], the currentQuestion displayed is the first question/answer set from the questions array.
  let possibleAnswers = shuffle(currentQuestion.a); //Shuffle the order of the possibleAnswers. No matter the shuffled order, the correct answer will always be correct.
  let questionEl = `<h2>${currentQuestion.q}</h2>`; // logs "<h2>Cycling question text here</h2>"

  for (let string of possibleAnswers) {  // For every string of the possibleAnswers array, make a button
    questionEl += `<button>${string}</button>`; // Put the question and four buttons into questionEl
  }
  
  // We wrapped strings of HTML tags around variables and put them inside questionEl.
  // Now render the contents of questionEl to the page.
  document.querySelector("main").innerHTML = questionEl;

  // We made buttons on the HTML main, so now we listen for their clicks.
  let buttons = document.querySelectorAll("main button");
  for (let eachButton of buttons) {   // For each button tag of all the button tags selected from main, listen to their click.
    eachButton.addEventListener("click", clickedAnswer);
  }
}

// This function is called from a click event on eachButton.
function clickedAnswer(e) {
  let userSelection = e.target.textContent; // When the user selects the answer button that ran this function, check its text content to verify if it is correct or incorrect.

  let correctAnswer = questions[currentQuestionIndexNumber].a[0]; // The first value hard-coded in the a array of questions is the correct answer.

  if (userSelection === correctAnswer) {
    //If the userSelection was correct, add 10 points to the score for every correct answer.
    score += rightAnswerReward; // += makes the score cumulative for every correct answer.
  }
  else {
    // If the user chose a wrong answer, award 0 points AND remove ten seconds from the timer. 
    timeRemaining = Math.max(0, timeRemaining - wrongAnswerPenalty); // The Math.max ensures that our timeRemaining cannot go lower than zero (even if technically negative time due to the wrongAnswerPenalty).
  }

  // Continue to the next question.
  currentQuestionIndexNumber++;

  // If we ran out of questions...
  if (currentQuestionIndexNumber >= questions.length) {
    // ...stop the timer and end the game.
    endTimer();
    endGame();
  }
  else { // If we still have questions, load the next one.
    loadQuestion();
  }
}

function endGame() {
  // Add the remaining seconds as points to the score.
  score += timeRemaining; // += keeps the score variable cumulative throughout the game instead of completely reassigning its past data.
  //Display ending score total on the page.
  document.querySelector("footer h2").textContent = `You scored ${score} points!`;
  //add score to high scores
  let highScores = getHighScores();
  highScores.push({score, initials});
  setHighScores(highScores);
  showHighScores();
}

function endTimer() {
  clearInterval(timer);
}

function tick() {
  // Post the remaining time to the page, updates every second (from startTimer's setInterval).
  document.querySelector("header time").textContent = timeRemaining;
  if (timeRemaining <= 0) { //if we run out of time, stop timer
    endTimer();
    endGame();
  }
  else timeRemaining--; //else decrement time remaining
}

function getHighScores() {
  let highScores = localStorage.getItem(storageName);
  if (!highScores) return [];
  return JSON.parse(highScores);
}

function setHighScores(highScores) {
  //Sort the order of the highscores in a descending order.
  highScores.sort(function (a, b){b.score - a.score}); 
  //limit number of high scores
  highScores = highScores.slice(0, maxNumberOfHighScores); 
  //The highscore to local storage
  localStorage.setItem(storageName, JSON.stringify(highScores));
}

function showHighScores() {
  let highScores = getHighScores();
  let questionEl = "";
  if (!highScores.length) {
    questionEl = "<li>No scores yet</li>";
  }
  else {
    for (let { initials, score } of highScores) {
      questionEl += `<li>${score} points ${initials}</li>`;
    }
  }
  document.querySelector("footer ol").innerHTML = questionEl;
}

// Used to shuffle(questions.a) in loadQuestion().
// This function will copy whatever array is passed in, randomize its items, and send it back out. 
// Because we cloned the array, it will not overwrite the order of the original array. 
function shuffle(arr) {
  let clone = JSON.parse(JSON.stringify(arr)); // Creates a deep array copy
  return clone.sort((a, b) => 0.5 - Math.random()); // Sorts the items in a random order
}

// Deep copy with JSON found at: https://lost-in-code.com/tutorials/js/array_copy/
// Custom sort found at: https://dev.to/codebubb/how-to-shuffle-an-array-in-javascript-2ikj#:~:text=The%20first%20and%20simplest%20way,10%5D%3B%20const%20shuffledArray%20%3D%20array.