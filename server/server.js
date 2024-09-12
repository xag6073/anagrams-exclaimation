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
    fs.readFile('index.html', (err, data) => {
      res.setHeader('Content-Type', 'text/html');
      res.statusCode = 200;
      res.end(data);
    });
  } else if(req.url === '/script.js') {
    fs.readFile('script.js', (err, data) => {
      res.setHeader('Content-Type', 'text/javascript');
      res.statusCode = 200;
      res.end(data);
    });
  } else if(req.url === '/style.css') {
    fs.readFile('style.css', (err, data) => {
      res.setHeader('Content-Type', 'text/css');
      res.statusCode = 200;
      res.end(data);
    });
  } else if(req.url === '/words.js') {
    fs.readFile('words.js', (err, data) => {
      res.setHeader('Content-Type', 'text/javascript');
      res.statusCode = 200;
      res.end(data);
    });
  } else if(req.url === '/checkValid') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const parsedData = JSON.parse(body);
      let msg = api.checkValid(parsedData.input);
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 200;
      res.end(JSON.stringify({ message: msg }));
    });
  } else if(req.url === '/newScramble') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const parsedData = JSON.parse(body);
      let word = api.newScramble(parsedData.length);
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 200;
      res.end(JSON.stringify({ word: word }));
    });
  } else if(req.url === '/results') {
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 200;
      res.end(JSON.stringify(api.returnResults()));
  } else {
    res.end();
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
