const { program } = require('commander');
const http = require('http');
const fs = require('fs/promises');
const path = require('path');
const superagent = require('superagent');
const options = program.opts();


program
    .option('-h, --host <host>', 'Адреса сервера')
    .option('-p, --port <port>', 'Порт сервера')
    .option('-c, --cache <cacheDir>', 'Шлях до директорії з кешем');

program.parse();


//перевірка на наявність обов*язкових параметрів і на правильність
if (!options.host || !options.port || !options.cache) {
    console.error('Please, specify necessary param');
    process.exit(1);
}

const requestListener = async function (req, res) {
    const filePath = path.join(options.cache, req.url + ".jpg");
    switch(req.method){
        case 'GET':
            fs.readFile(filePath)
            .then(content => {
              console.log('Картинку взято з кешу');
              res.setHeader("Content-Type", "image/jpeg");
              res.writeHead(200);
              res.end(content);
            })
            .catch(async () => {
              try {
                const content = await superagent.get(path.join('https://http.cat/' + req.url));
                await fs.writeFile(filePath, content.body);
                console.log('Картинку взято з сайту');
                res.setHeader("Content-Type", "image/jpeg");
                res.writeHead(200);
                res.end(content.body);
              } catch (err) {
                console.log('Запит закінчився помилкою');
                console.log(err);
                res.writeHead(404);
                res.end();
              }
            });
            break;
            case 'PUT':
              const chunks = [];
          
              //використовуємо масив якщо дані у запиті великі за розміром і їх не можливо отримати за один раз
              req.on('data', chunk => {
                  chunks.push(chunk);
              });
          
            
              req.on('end', async () => {
                //створюємо картинку з фрагментів
                  const imageBuffer = Buffer.concat(chunks); 
          
                  fs.writeFile(filePath, imageBuffer)
                  .then(()=>{
                    res.setHeader("Content-Type", "text/plain");
                      res.writeHead(201);
                      res.end('Created');
                  })
                  .catch(err=>{
                    console.error('Error saving image:', err);
                    res.writeHead(500);
                    res.end('Error saving image.');
                  })
              });
          
              req.on('error', (err) => {
                  console.error('Request error:', err);
                  res.writeHead(400);
                  res.end('Bad request.');
              });
              break;
              case 'DELETE':
                fs.unlink(filePath)
                .then(()=>{
                  res.setHeader("Content-Type", "text/plain");
                      res.writeHead(200);
                      res.end('Image deleted successfully.');
                })
                .catch(() =>{
                  console.error('Not Found:', filePath);
                  res.writeHead(404);
                  res.end();
                });
                break;
                default:
                  console.error('Wrong method');
                  res.writeHead(405);
                  res.end();
                  break;
            }
          }
    


const server = http.createServer(requestListener); 
    

server.listen(options.port, options.host, () => {
    console.log(`Server is running on http://${options.host}:${options.port}`);
});