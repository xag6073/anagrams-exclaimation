
addEventListener('DOMContentLoaded', (event) => {
    var timer;
    var onGame = false;
    var gameId = 0;

    //elements
    const input = document.getElementById('word-input');
    const output = document.getElementById('update-container');
    const scrambleContainer = document.getElementById('scramble-container');
    const wordLength = document.getElementById('word-length-select');
    const timerContainer = document.getElementById('timer-container');
    const scoreContainer = document.getElementById('score-container');
    const solutionList = document.getElementById('solution-list');
    const answerList = document.getElementById('answer-list');

    function newScramble() {
        //modify view
        output.textContent = '';
        answerList.innerHTML = '';
        scoreContainer.textContent = ''
        solutionList.innerHTML = '';

        //POST request to server to start new game
        input.setAttribute('maxlength', wordLength.value);
        handleFetch('/newScramble', 'POST', { length: wordLength.value })
            .then((json) => {
                let scramble = json.scramble;
                gameId = json.gameId;

                //display the scramble in random order
                scrambleContainer.innerHTML = ''; //clear the previous scramble
                while (scramble.length > 0) {
                    let rand = Math.floor(Math.random() * scramble.length);
                    let char = scramble.charAt(rand).toUpperCase();
                    scramble = scramble.substring(0, rand) + scramble.substring(rand + 1);
                    scrambleContainer.innerHTML += '<div class=\'scramble-item\'>' + char + '</div>';
                }
                onGameStart();
            })
            .catch(error => {
                alert('HTTP Error: try again later.');
            });
    }

    function onGameStart() {
        //start timer
        const timerLength = 40;
        const startTime = Date.now();
        onGame = true;

        clearInterval(timer);
        timeFunction(startTime, timerLength, timerContainer);
        timer = setInterval(timeFunction, 1000, startTime, timerLength, timerContainer);
    }

    function onGameEnd() {
        onGame = false;

        output.textContent = 'Game Over!';

        //GET request to update results
        handleFetch('/results', 'POST', { gameId: gameId })
            .then((json) => {
                scoreContainer.textContent = 'Score: ' + json.score;
                solutionList.textContent = 'Answer: ' + json.scramble
            })
            .catch(error => {
                alert('HTTP Error: results unavailable.');
            });

    }

    function timeFunction(startTime, timerLength, timerDiv) {
        const currentTime = Date.now();
        let timeLeft = timerLength - Math.floor((currentTime - startTime) / 1000);
        let seconds = Math.floor(timeLeft % 3600 % 60);

        timerDiv.textContent = seconds;

        if (timeLeft <= 0) {
            timeLeft = 0;
            clearInterval(timer);
            onGameEnd();
        }

    }

    function loadEventListeners() {
        document.getElementById('scramble-button').addEventListener('click', newScramble);

        input.addEventListener('keydown', function (event) {
            if (event.key === 'Enter' && onGame && input.value.length > 0) {

                //POST request to check if the input is valid
                handleFetch('/checkValid', 'POST', { input: input.value.toUpperCase(), gameId: gameId })
                    .then((json) => {
                        let message = json.message;
                        if (message === 'Valid') {
                            answerList.innerHTML += '<li class=\'answer-item\'>' + input.value + '</li>';
                        }
                        output.textContent = message;
                        input.value = '';
                    })
                    .catch(error => {
                        alert('HTTP Error: please try again.');
                    });

            }
        });
    }

    loadEventListeners();
})

async function handleFetch(url, method, data = null) {
    try {
        let options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        if (method === 'POST' && data) {
            options.body = JSON.stringify(data);
        }

        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error(error);
        throw error;
    }
}