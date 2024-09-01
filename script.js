
import {lengthArray} from './words.js';

let scramble = "";
var timer;
var onGame = false;
var score = 0;
const primeDictionary = {
    "a" : 2, "b": 3, "c": 5, "d": 7, "e": 11, "f": 13, "g": 17, "h": 19, "i": 23, "j": 29, "k": 31, "l": 37, "m": 41, "n": 43, "o": 47, "p": 53, "q": 59, "r": 61, "s": 67, "t": 71, "u": 73, "v": 79, "w": 83, "x": 89, "y": 97, "z": 101
}
var previousAnswers = [];

//elements
const input = document.getElementById("word-input");
const output = document.getElementById("update-container");
const answerList = document.getElementById("answer-list");
const scrambleContainer = document.getElementById("scramble-container");
const wordLength = document.getElementById("word-length-select");
const timerContainer = document.getElementById("timer-container");
const scoreContainer = document.getElementById("score-container");
const solutionList = document.getElementById("solution-list");

function newScramble() {
    //modify view
    output.textContent = "";
    answerList.innerHTML = "";
    scoreContainer.textContent = ""
    solutionList.innerHTML = "";
    previousAnswers = [];

    input.setAttribute("maxlength", wordLength.value);
    let wordArray = lengthArray(wordLength.value);
    let index = Math.floor((Math.random() * wordArray.length)); 
    let word = wordArray[index];
    scramble = word;

    //display the scramble in random order
    scrambleContainer.innerHTML = ""; //clear the previous scramble
    while(word.length > 0) {
        let rand = Math.floor(Math.random() * word.length);
        let char = word.charAt(rand).toUpperCase();
        word = word.substring(0, rand) + word.substring(rand + 1);
        scrambleContainer.innerHTML += "<div class=\"scramble-item\">"+char+"</div>";
    }

    //start timer
    const timerLength = 10;
    const startTime = Date.now();
    score = 0;
    onGame = true;

    clearInterval(timer);
    timeFunction(startTime, timerLength, timerContainer);
    timer = setInterval(timeFunction, 1000, startTime, timerLength, timerContainer);
}

function checkValid(input) {
    if(checkAnagram(scramble, input)) {
        if(checkWord(input)) {
            return "valid";
        } else {
            return "not a word!";
        }
    }
    return "not an anagram!";

}
 
function checkAnagram(input) {
    let productS = 1;
    for(let i = 0; i < scramble.length; i++) {
        productS *= primeDictionary[scramble.charAt(i)];
    }
    for(let i = 0; i < input.length; i++) {
        //if there is a character in input that is not in source,
        // then productS will have a decimal
        productS /= primeDictionary[input.charAt(i)];
    }

    //check for decimal
    return productS % 1 === 0; 
}

function checkWord(input) {
    let wordArray = lengthArray(input.length + ""); //convert to text for length array
    return wordArray.includes(input);
}

function onGameEnd() {
    onGame = false;

    output.textContent = "Game Over!";
    scoreContainer.textContent = "Score: " + score;
    solutionList.innerHTML += "<li>" + scramble + "</li>";
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
            let message = checkValid(input.value.toLowerCase());
            if(message === "valid" && !previousAnswers.includes(input.value)) {
                score += input.value.length;
                answerList.innerHTML += "<li>" + input.value + "</li>";
                previousAnswers.push(input.value);
            }

            output.textContent = message;            
            input.value = "";
        }
    }); 
}

loadEventListeners();