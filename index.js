const { program } = require('commander');
const http = require('http');
const fs = require('fs/promises');
const path = require('path');
program
    .option('-h, --host <host>', 'Адреса сервера')
    .option('-p, --port <port>', 'Порт сервера')
    .option('-c, --cache <cacheDir>', 'Шлях до директорії з кешем');

program.parse();
const options = program.opts();
//перевірка на наявність обов*язкових параметрів і на правильність
if (!options.host || !options.port || !options.cache) {
    console.error('Please, specify necessary param');
    process.exit(1);
}

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Server is working');
});

server.listen(options.port, options.host, () => {
  console.log(`Server running, url - > ${options.host}:${options.port}`);
});

function Get(code, filePath, res) {
  fs.promises.readFile(filePath)
  .then(data => {
    res.writeHead(200, { 'Content-Type': 'image/jpeg' });
    res.end(data);
  })
    .catch(() => {
      res.writeHead(404);
      res.end('File not found');
    });
}

function Put (filePath,req,res) {
  const data = [];
  req.on('data', chunk => data.push(chunk));
  req.on('end', () => {
    fs.promises.writeFile(filePath, Buffer.concat(data)) 
    .then(() => {
      res.writeHead(201);
      res.end('File created');
    })
    .catch(() => {
      res.writeHead(500);
      res.end('Internal Server Error');
    });
  });
}

function Delete (filePath, res) {
  fs.unlink(filePath)
  .then(() => {
    res.writeHead(200);
    res.end('File deleted');
  })
  .catch(() => {
    res.writeHead(404);
    res.end('File not found');
  });
}
   
    
