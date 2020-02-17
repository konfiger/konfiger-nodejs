
/*
 * The MIT License
 *
 * Copyright 2020 Adewale Azeez <azeezadewale98@gmail.com>.
 *
 */
 
const konfigerUtil = require("./KonfigerUtil.js")
const fs = require("fs")
 
function KonfigerStream(filePath, delimeter, seperator) {
	this.filePath = filePath;
	this.delimeter = '='
	this.seperator = '\n'
    
    this.validateFileExistence(filePath)
    if (delimeter && !seperator) {
        konfigerUtil.throwError("io.github.thecarisma.KonfigerStream", "Invalid length of argument, seperator parameter is missing")
    }
    if (delimeter && seperator) {
        if (!konfigerUtil.isChar(delimeter)) { 
            konfigerUtil.throwError("io.github.thecarisma.KonfigerStream", "invalid argument for delimeter expecting char found " + konfigerUtil.typeOf(delimeter)) 
        }
        if (!konfigerUtil.isChar(seperator)) { 
            konfigerUtil.throwError("io.github.thecarisma.KonfigerStream", "invalid argument for seperator expecting char found " + konfigerUtil.typeOf(seperator)) 
        }
    }    
}

KonfigerStream.prototype.validateFileExistence = function(filePath) {
    if (!filePath) {
        konfigerUtil.throwError("io.github.thecarisma.KonfigerStream", "The file path cannot be null")
    }
    if (!konfigerUtil.isString(filePath)) {
        konfigerUtil.throwError("io.github.thecarisma.KonfigerStream", "Invalid argument expecting string found " + konfigerUtil.typeOf(filePath))
    }
    if (!fs.existsSync(filePath)) {
        konfigerUtil.throwError("io.github.thecarisma.KonfigerStream", "The file does not exists " + filePath)
    }    
}

KonfigerStream.prototype.hasNext = function() {
    fs.open(this.filePath, 'r', function(err, fd) {
      if (err)
        throw err;
      var buffer = new Buffer(1);
      while (true)
      {   
        var num = fs.readSync(fd, buffer, 0, 1, null);
        if (num === 0)
          break;
        
        console.log('byte read-', buffer.toString('utf-8', 0, buffer[0]));
      }
    });
    return false
}

KonfigerStream.prototype.next = function() {
    return ""
}

module.exports = KonfigerStream