const { program } = require('commander');


program
    .option('-h, --host <host>', 'server host')
    .option('-p, --port <port>', 'server port')
    .option('-c, --cache <cacheDir>', 'cache directory');

program.parse();
const options = program.opts();
//перевірка на наявність обов*язкових параметрів і на правильність
if (!options.host || !options.port || !options.cache) {
    console.error('Please, specify necessary param');
    process.exit(1);
}