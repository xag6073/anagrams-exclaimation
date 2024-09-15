
let games = new Map();

class Game {
  constructor(id, score, scramble, previousAnswers) {
    this.id = id;
    this.score = score;
    this.scramble = scramble;
    this.previousAnswers = previousAnswers;
  }
}

function addGame(scramble) {
  //generates random id that is not in map
  let id = Math.floor(Math.random() * 1000);
  while(games.has(id)) {
    id = Math.floor(Math.floor(Math.random() * 1000));
  }

  let game = new Game(id, 0, scramble, []);
  games.set(game.id, game);
  return game;
}

function removeGame(game) {
  if(!games.delete(game.id)) {
    return false;
  }
  return true;
}

module.exports = { addGame, removeGame, games };