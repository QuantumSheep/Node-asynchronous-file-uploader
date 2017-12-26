"use strict";

const fs = require("fs");

module.exports = class FileUploader {
    constructor(toDirectory = __dirname + '/', maxBytes = (20 * 1024 * 1024)) {
        this.toDirectory = toDirectory;
        this.maxBytes = maxBytes;
    };

    upload(name, file, callback = (err, wstream) => {}) {
        if (this.maxBytes >= file.size) {
            let rstream = fs.createReadStream(file.path);
            let wstream = fs.createWriteStream(this.toDirectory + file.name);

            rstream.pipe(wstream);

            callback(null, wstream);
        } else {
            callback("FILETOOHEAVY", null);
        }
    }
}