

const primeDictionary = {
  "A": 2, "B": 3, "C": 5, "D": 7, "E": 11, "F": 13, "G": 17, "H": 19, "I": 23, "J": 29, "K": 31, "L": 37, "M": 41, "N": 43, "O": 47, "P": 53, "Q": 59, "R": 61, "S": 67, "T": 71, "U": 73, "V": 79, "W": 83, "X": 89, "Y": 97, "Z": 101
};

let wordSet = new Set();
let wordArray = [[]];

let score = 0;
let scramble = "";
let previousAnswers = [];

function loadWords() {
  const fs = require("fs");
  const readline = require("node:readline");

  const fileStream = fs.createReadStream("server/dict.txt");
  const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
  });

  rl.on("line", (line) => {
      addWord(line);
  });

  rl.on("close", () => {
      console.log("words loaded");
      rl.close();
  });
}

function addWord(word) {
  wordSet.add(word);
  if(wordArray[word.length] === undefined) {
      wordArray[word.length] = [];
  }
  wordArray[word.length].push(word);
}

function newScramble(length) {
  score = 0;
  scramble = wordArray[length][Math.floor(Math.random() * wordArray[length].length)];
  return scramble;
}

function checkValid(input) {
  if(checkAnagram(scramble, input)) {
      if(previousAnswers.includes(input)) {
          return "already used";
      } else if(checkWord(input)) {
          previousAnswers.push(input);
          score += input.length;
          return "valid";
      } else {
          return "not a word";
      }
  }
  return "not an anagram";
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
  return wordSet.has(input);
}

function returnResults() {
  return {score: score, scramble: scramble};
}

module.exports = { loadWords, checkValid, newScramble, returnResults };