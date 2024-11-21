const { program } = require('commander');
const http = require('http');

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
    res.end('Server is working!');
});

server.listen(options.port, options.host, () => {
  console.log(`Server running at http://${options.host}:${options.port}/`);
});