


var timer;
var onGame = false;
var score = 0;

//elements
const input = document.getElementById("word-input");
const output = document.getElementById("update-container");
const scrambleContainer = document.getElementById("scramble-container");
const wordLength = document.getElementById("word-length-select");
const timerContainer = document.getElementById("timer-container");
const scoreContainer = document.getElementById("score-container");
const solutionList = document.getElementById("solution-list");
const answerList = document.getElementById("answer-list");

function newScramble() {
    //modify view
    output.textContent = "";
    answerList.innerHTML = "";
    scoreContainer.textContent = ""
    solutionList.innerHTML = "";

    input.setAttribute("maxlength", wordLength.value);
    fetch('/newScramble', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({length: wordLength.value}),
    })
    .then(response => response.json()) 
    .then((json) => {
        let word = json.word;

        //display the scramble in random order
        scrambleContainer.innerHTML = ""; //clear the previous scramble
        while(word.length > 0) {
            let rand = Math.floor(Math.random() * word.length);
            let char = word.charAt(rand).toUpperCase();
            word = word.substring(0, rand) + word.substring(rand + 1);
            scrambleContainer.innerHTML += "<div class=\"scramble-item\">"+char+"</div>";
        }
        onGameStart();
    });
}

function onGameStart() {
    //start timer
    const timerLength = 20;
    const startTime = Date.now();
    onGame = true;

    clearInterval(timer);
    timeFunction(startTime, timerLength, timerContainer);
    timer = setInterval(timeFunction, 1000, startTime, timerLength, timerContainer);
}

function onGameEnd() {
    onGame = false;

    output.textContent = "Game Over!";

    //update view on results
    fetch('/results')
    .then(response => response.json())
    .then((json) => {
        scoreContainer.textContent = "Score: " + json.score;
        solutionList.textContent = "Answer: " + json.scramble
    })
    
}

function timeFunction(startTime, timerLength, timerDiv) {
    const currentTime = Date.now();
    let timeLeft = timerLength - Math.floor((currentTime - startTime) / 1000);
    let seconds = Math.floor(timeLeft % 3600 % 60);

    timerDiv.textContent = seconds;

    if(timeLeft <= 0) {
        timeLeft = 0;
        clearInterval(timer);
        onGameEnd();
    }
     
}

function loadEventListeners() {
    document.getElementById("scramble-button").addEventListener("click", newScramble);
    
    input.addEventListener('keydown', function(event) {
        if (event.key === "Enter" && onGame && input.value.length > 0) {
            //check if the input is valid w/ server
            fetch('/checkValid', {
                method: "POST",
                body: JSON.stringify({input: input.value.toUpperCase()}),
            })
            .then(response => response.json())
            .then((json) => {
                let message = json.message;
                if(message === "Valid") {
                    answerList.innerHTML += "<li class=\"answer-item\">" + input.value + "</li>";
                }
                output.textContent = message;
                input.value = "";
            });        
        }
    }); 
}

loadEventListeners();