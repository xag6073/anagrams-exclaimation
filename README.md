# Anagrams!

A game focused around finding anagrams (and proper subsets) of a random scramble of characters. 

See how many you can find within the time limit and achieve a high score!

## Getting Started

### Prequisties 

* [Node.js](https://github.com/nodejs)

### Execution 

Run the following command in the project folder to start the Nodejs server:
```
node server/server.js
```

By default the server listens on http://0.0.0.0:3000/. 

> Hostname and port can be changed at the top of the server.js file.

## Description

To play a game of anagrams!:

* Once the server is started, go to the url where the server is running.
  
* Click "Start" to begin a new game. The scramble should then appear and the timer started.
  * Next to the Start button is a length selector. This determines the length of the anagrams to solve.
    
* Type your guesses into the input bar directly above "Start". Press enter to submit.
  * The page will display "Valid", "Not an Anagram", or "Not a Word" depending on the validity of the guess.
    
* Wait for the timer to countdown to see your score and the orignal word!

> **Note**: Multiple anagram games can occur simultaneously. Any user who starts will be assigned a new game independent of others.
