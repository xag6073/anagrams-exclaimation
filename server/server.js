const { createServer } = require('node:http');
const api = require('./api.js');

const fs = require('node:fs');

const hostname = '127.0.0.1';
const port = 3000;

api.loadWords();

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
