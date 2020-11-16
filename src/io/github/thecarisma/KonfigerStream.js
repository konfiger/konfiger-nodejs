
/*
 * The MIT License
 *
 * Copyright 2020 Adewale Azeez <azeezadewale98@gmail.com>.
 *
 */

const konfigerUtil = require("./KonfigerUtil.js")
const fs = require("fs")

function fileStream(filePath, delimiter, separator, errTolerance) {
    return new KonfigerStream(filePath, delimiter, separator, errTolerance, true)
}

function stringStream(rawString, delimiter, separator, errTolerance) {
    return new KonfigerStream(rawString, delimiter, separator, errTolerance, false)
}
 
function KonfigerStream(streamObj, delimiter, separator, errTolerance, isFile) {
	this.streamObj = streamObj
	this.delimiter = (delimiter ? delimiter : '=')
	this.separator = (separator ? separator : '\n')
	this.errTolerance = (errTolerance === true ? errTolerance : false)
    this.isFile = isFile
    this.trimingKey = true
    this.trimingValue = true
    this.commentPrefix = "//"
    this.continuationChar = "\\"
    this.isFirst = 0
    
    if (this.isFile === true) {
        this.validateFileExistence(streamObj)
        this.buffer = new Buffer.alloc(1)
    } else {
        if (!konfigerUtil.isString(this.streamObj)) {
            throw new Error("io.github.thecarisma.KonfigerStream: Invalid first argument expecting string found " 
                            + konfigerUtil.typeOf(this.streamObj))
        }
    }
    if (!konfigerUtil.isBoolean(this.errTolerance)) {
        throw new Error("io.github.thecarisma.KonfigerStream: Invalid argument for errTolerance expecting boolean found " 
                        + konfigerUtil.typeOf(errTolerance))
    }
    if (delimiter && !separator) {
        throw new Error("io.github.thecarisma.KonfigerStream: Invalid length of argument, separator or delimiter parameter is missing")
    }
    if (!konfigerUtil.isChar(this.delimiter)) { 
        throw new Error("io.github.thecarisma.KonfigerStream: Invalid argument for delimiter expecting char found " + konfigerUtil.typeOf(delimiter)) 
    }
    if (!konfigerUtil.isChar(this.separator)) { 
        throw new Error("io.github.thecarisma.KonfigerStream: Invalid argument for separator expecting char found " + konfigerUtil.typeOf(separator)) 
    }  
    
    this.readPosition = 0
    this.hasNext_ = false
    this.doneReading_ = false
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

KonfigerStream.prototype.isTrimmingKey = function() {
    return this.trimingKey
}

KonfigerStream.prototype.setTrimmingKey = function(trimingKey) {
    if (!konfigerUtil.isBoolean(trimingKey)) {
        throw new Error("io.github.thecarisma.KonfigerStream: Invalid argument, expecting a boolean found " + 
                        konfigerUtil.typeOf(trimingKey))
    }
    this.trimingKey = trimingKey
}

KonfigerStream.prototype.isTrimmingValue = function() {
    return this.trimingValue
}

KonfigerStream.prototype.setTrimmingValue = function(trimingValue) {
    if (!konfigerUtil.isBoolean(trimingValue)) {
        throw new Error("io.github.thecarisma.KonfigerStream: Invalid argument, expecting a boolean found " + 
                        konfigerUtil.typeOf(trimingValue))
    }
    this.trimingValue = trimingValue
}

KonfigerStream.prototype.getCommentPrefix = function() {
    return this.commentPrefix
}

KonfigerStream.prototype.setCommentPrefix = function(commentPrefix) {
    if (!konfigerUtil.isString(commentPrefix)) {
        throw new Error("io.github.thecarisma.KonfigerStream: Invalid argument, expecting a string found " + 
                        konfigerUtil.typeOf(commentPrefix))
    }
    this.commentPrefix = commentPrefix
}

KonfigerStream.prototype.getContinuationChar = function() {
    return this.continuationChar
}

KonfigerStream.prototype.setContinuationChar = function(continuationChar) {
    if (!konfigerUtil.isChar(continuationChar)) {
        throw new Error("io.github.thecarisma.KonfigerStream: Invalid argument, expecting a char found " + 
                        konfigerUtil.typeOf(continuationChar))
    }
    this.continuationChar = continuationChar
}

KonfigerStream.prototype.errorTolerance = function(errTolerance) {
    if (!konfigerUtil.isBoolean(errTolerance)) {
        throw new Error("io.github.thecarisma.KonfigerStream: Invalid argument, expecting a boolean found " + 
                        konfigerUtil.typeOf(errTolerance))
    }
    this.errTolerance = errTolerance
}

KonfigerStream.prototype.isErrorTolerant = function() {
	return this.errTolerance
}

KonfigerStream.prototype.hasNext = function() {
    if (!this.doneReading_) {
        var commentSize = this.commentPrefix.length
        var subCount = 0
        if (this.isFile === true) {
            var fd = fs.openSync(this.streamObj, 'r')
            if (!fd) {
                this.doneReading()
                throw fd
            }
            var num = fs.readSync(fd, this.buffer, 0, 1, this.readPosition)
            if (num === 0) {
                this.doneReading()
            } else {                
                while (num !== 0) {
                    num = fs.readSync(fd, this.buffer, 0, 1, this.readPosition)
                    while (this.buffer.toString('utf-8') == this.commentPrefix[subCount]) {
                        ++subCount
                        num = fs.readSync(fd, this.buffer, 0, 1, this.readPosition+subCount)
                    }
                    this.isFirst |= 1
                    if (subCount === commentSize) {
                        ++this.readPosition
                        while (num !== 0 && this.buffer.toString('utf-8') !== this.separator) {
                            ++this.readPosition
                            num = fs.readSync(fd, this.buffer, 0, 1, this.readPosition)
                        }
                        ++this.readPosition
                        return this.hasNext()
                    }
                    if (this.buffer.toString('utf-8').trim() === '') {
                        ++this.readPosition
                        continue
                    }
                    this.hasNext_ = true
                    return this.hasNext_
                }
                this.hasNext_ = false 
                return this.hasNext_    
            }
        } else {
            while (this.readPosition < this.streamObj.length) {
                while (this.streamObj[subCount+this.readPosition] == this.commentPrefix[subCount]) {
                    ++subCount
                }
                this.isFirst |= 1
                if (subCount === commentSize) {
                    ++this.readPosition
                    while (this.readPosition < this.streamObj.length && this.streamObj[this.readPosition] !== this.separator) {
                        ++this.readPosition
                    }
                    ++this.readPosition
                    return this.hasNext()
                }
                if (this.streamObj[this.readPosition].trim() === "") {
                    ++this.readPosition
                    continue
                }
                
                this.hasNext_ = true
                return this.hasNext_
            }
            this.hasNext_ = false 
            return this.hasNext_            
        }
    }
    return this.hasNext_
}

KonfigerStream.prototype.next = function() {
    if (this.doneReading_) {
        throw new Error("io.github.thecarisma.KonfigerStream: You cannot read beyound the stream length, always use hasNext() to verify the Stream still has an entry")
    }
    var key = ""
    var value = ""
    var parseKey = true
    var prevPrevChar = null
    var prevChar = null
    var line = 1
    var column = 0
    
    if (this.isFile === true) {
        var fd = fs.openSync(this.streamObj, 'r')
        if (!fd) {
            this.doneReading()
            throw fd
        }
        while (true) {
            var num = fs.readSync(fd, this.buffer, 0, 1, this.readPosition)
            if (num === 0) {
                if (key !== "") {
                    if (parseKey === true && this.errTolerance === false) {
                        throw new Error("io.github.thecarisma.KonfigerStream: Invalid entry detected near Line " + line + ":" + column)
                        continue
                    }
                }
                this.doneReading()
                break
            }
            this.readPosition++
            var char_ = this.buffer.toString('utf-8', 0, this.buffer[0])
            column++;
            if (char_ === '\n') {
                line++
                column = 0
                if (!parseKey && prevChar == this.continuationChar && prevPrevChar !== '\\') {
                    if (value[value.length-1] == '\r') {
                        value = value.slice(0, -2);
                    } else {
                        value = value.slice(0, -1);
                    }                    
                    do {
                        var num = fs.readSync(fd, this.buffer, 0, 1, this.readPosition)
                        char_ = this.buffer.toString('utf-8', 0, this.buffer[0])
                        this.readPosition++
                    } while(char_.trim() == "")
                    this.readPosition--
                    continue
                }
            }
            if (char_ === this.separator && prevChar != '^' ) {
                if (parseKey === true && this.errTolerance === false) {
                    throw new Error("io.github.thecarisma.KonfigerStream: Invalid entry detected near Line " + line + ":" + column)
                    continue
                }
                break
            }
            if (char_ === this.delimiter && parseKey) {
                if (value !== "" && this.errTolerance !== false) {
                    throw new Error("io.github.thecarisma.KonfigerStream: The input is imporperly sepreated near Line " + line + ":" + column+". Check the separator")
                    continue
                }
                parseKey = false
                continue
            }
            if (parseKey === true) {
                key += char_
            } else {
                value += char_
            }
            prevPrevChar = (char_ == '\r' ? prevPrevChar : prevChar)
			prevChar = (char_ == '\r' ? (prevChar != '\\' ? '\0' : '\\') : char_)
        }
    } else {
        for (; this.readPosition <= this.streamObj.length; ++this.readPosition) {
            if (this.readPosition === this.streamObj.length) {
                if (key !== "") {
                    if (parseKey === true && this.errTolerance === false) {
                        throw new Error("io.github.thecarisma.Konfiger: Invalid entry detected near Line " + line + ":" + column)
                        continue
                    }
                }
                this.doneReading()
                break
            }
            var character = this.streamObj[this.readPosition]
            column++;
            if (character === '\n') {
                line++;
                column = 0
                if (!parseKey && prevChar == this.continuationChar && prevPrevChar !== '\\') {
                    if (value[value.length-1] == '\r') {
                        value = value.slice(0, -2);
                    } else {
                        value = value.slice(0, -1);
                    }                    
                    do {
                        this.readPosition++
                        character = this.streamObj[this.readPosition]
                    } while(character.trim() == "")
                    this.readPosition--
                    continue
                }
            }
            if (character === this.separator && prevChar != '^') {
                if (parseKey === true && this.errTolerance === false) {
                    throw new Error("io.github.thecarisma.Konfiger: Invalid entry detected near Line " + line + ":" + column)
                    continue
                }
                break
            } 
            if (character === this.delimiter && parseKey) {
                if (value !== "" && this.errTolerance === false) {
                    throw new Error("io.github.thecarisma.Konfiger: The input is imporperly sepreated near Line " + line + ":" + column+". Check the separator")
                    continue
                }
                parseKey = false 
                continue
            }
            if (parseKey) {
                key += character
            } else {
                value += character
            }
            prevPrevChar = (character == '\r' ? prevPrevChar : prevChar)
			prevChar = (character == '\r' ? (prevChar != '\\' ? '\0' : '\\') : character)
        }
        ++this.readPosition
    }
    
    return [ 
                (this.trimingKey ? key.trim() : key), 
                (this.trimingValue ? konfigerUtil.unEscapeString(value, [this.separator]).trim() : konfigerUtil.unEscapeString(value, [this.separator]) )
           ]
}

KonfigerStream.prototype.doneReading = function() {
    this.hasNext_ = false
    this.doneReading_ = true
}

module.exports =  { 
    fileStream, 
    stringStream 
}
