
/*
 * The MIT License
 *
 * Copyright 2020 Adewale Azeez <azeezadewale98@gmail.com>.
 *
 */

const konfigerUtil = require("./KonfigerUtil.js")
const fs = require("fs")

function fileStream(filePath, delimeter, seperator, errTolerance) {
    return new KonfigerStream(filePath, delimeter, seperator, errTolerance, true)
}

function stringStream(rawString, delimeter, seperator, errTolerance) {
    return new KonfigerStream(rawString, delimeter, seperator, errTolerance, false)
}
 
function KonfigerStream(streamObj, delimeter, seperator, errTolerance, isFile) {
	this.streamObj = streamObj
	this.delimeter = (delimeter ? delimeter : '=')
	this.seperator = (seperator ? seperator : '\n')
	this.errTolerance = (errTolerance ? errTolerance : false)
    this.isFile = isFile
    
    if (this.isFile === true) {
        this.validateFileExistence(streamObj)
    }
    if (!konfigerUtil.isBoolean(this.errTolerance)) {
        throw new Error("io.github.thecarisma.KonfigerStream: Invalid argument for errTolerance expecting boolean found " 
                        + konfigerUtil.typeOf(errTolerance))
    }
    if (delimeter && !seperator) {
        throw new Error("io.github.thecarisma.KonfigerStream: Invalid length of argument, seperator parameter is missing")
    }
    if (delimeter && seperator) {
        if (!konfigerUtil.isChar(delimeter)) { 
            throw new Error("io.github.thecarisma.KonfigerStream: invalid argument for delimeter expecting char found " + konfigerUtil.typeOf(delimeter)) 
        }
        if (!konfigerUtil.isChar(seperator)) { 
            throw new Error("io.github.thecarisma.KonfigerStream: invalid argument for seperator expecting char found " + konfigerUtil.typeOf(seperator)) 
        }
    }    
    
    this.readPosition = 0
    this.hasNext_ = false
    this.doneReading_ = false
    this.buffer = new Buffer.alloc(1)
}

KonfigerStream.prototype.validateFileExistence = function(filePath) {
    if (!filePath) {
        throw new Error("io.github.thecarisma.KonfigerStream: The file path cannot be null")
    }
    if (!konfigerUtil.isString(filePath)) {
        throw new Error("io.github.thecarisma.KonfigerStream: Invalid argument expecting string found " + konfigerUtil.typeOf(filePath))
    }
    if (!fs.existsSync(filePath)) {
        throw new Error("io.github.thecarisma.KonfigerStream: The file does not exists " + filePath)
    }    
}

KonfigerStream.prototype.hasNext = function() {
    if (!this.doneReading_) {
        if (this.isFile === true) {
            var fd = fs.openSync(this.streamObj, 'r')
            if (!fd) {
                this.doneReading()
                throw fd
            }
            var num = fs.readSync(fd, this.buffer, 0, 1, this.readPosition)
            if (num === 0) {
                this.doneReading()
                return
            }
        } else {
            console.log("booyakasha")
        }
        this.hasNext_ = true
    }
    return this.hasNext_
}

KonfigerStream.prototype.next = function() {
    if (this.doneReading_) {
        throw new Error("io.github.thecarisma.KonfigerStream: You cannot read beyound the stream length, always use hasNext() to verify the Stream still has an entry")
    }
    var fd = fs.openSync(this.streamObj, 'r')
    if (!fd) {
        this.doneReading()
        throw fd
    }
    var key = ""
    var value = ""
    var parseKey = true
    var prevChar = null
    var line = 1
    var column = 0
    
    if (this.isFile === true) {
        while (true) {
            var num = fs.readSync(fd, this.buffer, 0, 1, this.readPosition)
            if (num === 0) {
                if (key !== "") {
                    if (parseKey === true && this.errTolerance === false) {
                        throw new Error("io.github.thecarisma.KonfigerStream: Invalid entry detected near Line " + line + ":" + column);
                    }
                }
                this.doneReading()
                break
            }
            this.readPosition++
            var char_ = this.buffer.toString('utf-8', 0, this.buffer[0])
            if (char_ === this.seperator && prevChar != '\\') {
                if (parseKey === true && this.errTolerance === false) {
                    throw new Error("io.github.thecarisma.KonfigerStream: Invalid entry detected near Line " + line + ":" + column);
                }
                break
            }
            if (char_ === this.delimeter && parseKey) {
                if (value !== "" && this.errTolerance !== false) {
                    throw new Error("io.github.thecarisma.KonfigerStream: The input is imporperly sepreated near Line " + line + ":" + column+". Check the separator")
                }
                parseKey = false
                continue
            }
            if (parseKey === true) {
                key += char_
            } else {
                value += char_
            }
            prevChar = char_
        }
    } else {
        console.log("booyakasha")
    }
    return [key, konfigerUtil.unEscapeString(value, [this.seperator])]
}

KonfigerStream.prototype.doneReading = function() {
    this.hasNext_ = false
    this.doneReading_ = true
}

module.exports =  { 
    fileStream, 
    stringStream 
}
