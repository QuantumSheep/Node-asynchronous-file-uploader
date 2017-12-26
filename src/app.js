const express = require('express');
const app = express();
const formidable = require('formidable');
const fs = require("fs");
const http = require('http');
const server = http.Server(app);
const io = require('socket.io')(server);

let clientSocket;

app.use(express.static('views'));

io.on('connection', (socket) => {
    clientSocket = socket;
});

app.get('/', (req, res, next) => {
    res.sendFile('index.html');
});

app.post('/uploadfile', (req, res, next) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req);

    form.on('progress', (br, be) => {
        let oldPer = 0;
        let per = (br * 100) / be;

        if(clientSocket) {
            clientSocket.emit('file progress', per);
        }
    });

    form.on('file', function (name, file) {
        if(file.size <= 20 * 1024 * 1024) {
            let rstream = fs.createReadStream(file.path);
            let wstream = fs.createWriteStream(__dirname + '/../uploads/' + file.name);
            
            rstream.pipe(wstream);

            wstream.on('finish', function () {
                res.setHeader("Content-Type", "text/plain");
                res.end('done');
            });
        } else {
            res.setHeader("Content-Type", "text/plain");
            res.end('error');
        }
    });
});

server.listen(2000);