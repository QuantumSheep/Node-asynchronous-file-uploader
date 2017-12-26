const express = require('express');
const app = express();
const formidable = require('formidable');
const http = require('http');
const server = http.Server(app);
const FileUploader = require('./FileUploader');

app.use(express.static('views'));

app.get('/', (req, res, next) => {
    res.sendFile('index.html');
});

app.post('/uploadfile', (req, res, next) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.multiples = true;
    form.parse(req);

    form.on('error', (err) => {});

    form.on('file', function (name, file) {
        let fileupload = new FileUploader(__dirname + '/../uploads/');

        fileupload.upload(name, file, (err, wstream) => {
            if (err) {
                res.setHeader("Content-Type", "text/plain");
                res.end(err);
            } else {
                wstream.on('finish', () => {
                    res.setHeader("Content-Type", "text/plain");
                    res.end('done');
                });
            }
        });
    });
});

server.listen(2000);