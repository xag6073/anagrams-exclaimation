/**
 * @file server.js
 * @description This file creates an HTTP server to handle various routes for an anagram project.
 * 
 * @requires node:http
 * @requires ./api.js
 * @requires node:fs
 * 
 * @constant {string} hostname - The hostname for the server.
 * @constant {number} port - The port number for the server.
 */

const { createServer } = require('http');
const api = require('./api.js');
const fs = require('fs');

hostname = 'localhost';
port = 3000;

api.loadWords(); //starts api

/** 
 * @function createServer
 * @description Creates an HTTP server to handle various routes for an anagram project.
 *
 * Routes:
 * - `/`: Serves the `index.html` file.
 * - `/script.js`: Serves the `script.js` file.
 * - `/style.css`: Serves the `style.css` file.
 * - `/words.js`: Serves the `words.js` file.
 * - `/checkValid`: Accepts a POST request with JSON data to check if the input is a valid word.
 * - `/newScramble`: Accepts a POST request with JSON data to generate a new scrambled word of a given length.
 * - `/results`: Returns the results of the anagram game in JSON format.
 * 
 * Each route sets the appropriate `Content-Type` header and status code before sending the response.
 * 
 * @param {http.IncomingMessage} req - The incoming request object.
 * @param {http.ServerResponse} res - The outgoing response object.
 */

const server = createServer((req, res) => {
  if(req.url === '/') {
    handleGetFileRequest('index.html', res);

  } else if(req.url === '/script.js') {
    handleGetFileRequest('script.js', res);

  } else if(req.url === '/style.css') {
    handleGetFileRequest('style.css', res);

  } else if(req.url === '/checkValid') {
    handlePostRequest(req, res, (parsedData) => {
      const msg = api.checkValid(parsedData.input, parsedData.gameId);
      if(msg === "No Game Found") {
        res.statusCode = 404;
        res.end();
      } else {
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 200;
        res.end(JSON.stringify({ message: msg}));
      }
  });

  } else if(req.url === '/newScramble') {
    handlePostRequest(req, res, (parsedData) => {
      const game = api.newScramble(parsedData.length);
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 200;
      res.end(JSON.stringify({ gameId: game.id, scramble: game.scramble }));
    });
    
  } else if(req.url === '/results') {
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 200;
      res.end(JSON.stringify(api.returnResults()));
      
  } else {
    res.statusCode = 404;
    res.end();
  }
});

function handleGetFileRequest(req, res) {
  fs.readFile(req, (err, data) => {
    if(err) {
      console.error(err.message);
      res.statusCode = 500;
      res.end();
    } else {
      res.setHeader('Content-Type', 'text/javascript');
      res.statusCode = 200;
      res.end(data);
    }
  });
}

function handlePostRequest(req, res, callback) {
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });
  req.on('end', () => {
    try {
      const parsedData = JSON.parse(body);
      callback(parsedData);
    } catch (err) {
      console.error(err.message);
      res.statusCode = 400;
      res.end();
    }
  });
}

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
