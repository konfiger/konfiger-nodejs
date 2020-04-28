
/*
 * The MIT License
 *
 * Copyright 2020 Adewale Azeez <azeezadewale98@gmail.com>.
 *
 */
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
 
const konfigerUtil = require("./KonfigerUtil.js")
const KonfigerStream = require("./KonfigerStream.js")
const fs = require("fs")
 
const MAX_CAPACITY = 10000000

function fromFile(filePath, lazyLoad, delimeter, seperator) {
    return fromStream(KonfigerStream.fileStream(filePath, delimeter, seperator), lazyLoad)
}

function fromString(rawString, lazyLoad, delimeter, seperator) {
    return fromStream(KonfigerStream.stringStream(rawString, delimeter, seperator), lazyLoad)
}

function fromStream(konfigerStream, lazyLoad) {
    const konfiger = new Konfiger(konfigerStream.delimeter, konfigerStream.seperator, lazyLoad, konfigerStream)
    konfiger.filePath = konfigerStream.filePath
    return konfiger
}

function Konfiger(delimeter, seperator, lazyLoad, stream) {
    this.hashcode = 0
    this.stream = stream
    this.loadingEnds = false
    this.lazyLoad = (lazyLoad ? lazyLoad : false)
    this.konfigerObjects = new Map()
    this.delimeter = delimeter
    this.seperator = seperator
    this.caseSensitive = true
    this.changesOccur = true
    this.stringValue = ""
    this.readIndex = 0
    this.filePath = undefined
    
    if (!this.lazyLoad) {
        this.lazyLoader()
    }
    if (!konfigerUtil.isBoolean(this.lazyLoad)) {
        throw new Error("io.github.thecarisma.Konfiger: Invalid argument, the lazyLoad parameter must be a Boolean")
    }
    
    
    this.enableCache_ = true
    this.prevCachedObject = { ckey : "", cvalue : null }
    this.currentCachedObject = { ckey : "", cvalue : null }
}

Konfiger.prototype.put = function(key, value) {
    if (konfigerUtil.isString(key)) {
        if (konfigerUtil.isString(value)) {
            this.putString(key, value)
            
        } else if (konfigerUtil.isBoolean(value)) {
            this.putBoolean(key, value)
            
        } else if (konfigerUtil.isNumber(value)) {
            this.putLong(key, value)
            
        } else {
            this.putString(key, JSON.stringify(value))
        }
        
        
    } else {
        konfigerUtil.throwError("io.github.thecarisma.Konfiger", "invalid argument, key must be a string")
    }
}

Konfiger.prototype.putString = function(key, value) {
    if (!konfigerUtil.isString(key)) {
        throw new Error("io.github.thecarisma.Konfiger: Invalid argument, key must be a string")
    }
    if (!konfigerUtil.isString(value)) {
        throw new Error("io.github.thecarisma.Konfiger: invalid argument, expecting String found " + konfigerUtil.typeOf(value))
    }
    if (this.lazyLoad && !this.loadingEnds && this.contains(key)) {
        var _value = this.getString(key)
        if (_value === value) {
            return
        }
    }
    if (!this.contains(key)) {
        if (this.konfigerObjects.size === MAX_CAPACITY) {
            throw new Error("io.github.thecarisma.Konfiger: Konfiger has reached it maximum capacity 10,000,000")
        }
    }    
    this.konfigerObjects.set(key, value)
    this.changesOccur = true
    if (this.enableCache_) {
        this.shiftCache(key, value)
    }
}

Konfiger.prototype.putBoolean = function(key, value) {
    if (!konfigerUtil.isBoolean(value)) {
        throw new Error("io.github.thecarisma.Konfiger: invalid argument, expecting Boolean found " + konfigerUtil.typeOf(value))
    }
    this.putString(key, value.toString())
}

Konfiger.prototype.putLong = function(key, value) {
    if (!konfigerUtil.isNumber(value)) {
        throw new Error("io.github.thecarisma.Konfiger: invalid argument, expecting Number found " + konfigerUtil.typeOf(value))
    }
    this.putString(key, value.toString())
}

Konfiger.prototype.putInt = function(key, value) {
    this.putLong(key, value)
}

Konfiger.prototype.putFloat = function(key, value) {
    if (!konfigerUtil.isFloat(value)) {
        throw new Error("io.github.thecarisma.Konfiger: invalid argument, expecting Float found " + konfigerUtil.typeOf(value))
    }
    this.putString(key, value.toString())
}

Konfiger.prototype.putDouble = function(key, value) {
    this.putFloat(key, value)
}

Konfiger.prototype.putComment = function(theComment) {
    this.putString(this.stream.commentPrefix, theComment)
}

Konfiger.prototype.get = function(key, defaultValue) {
    if (!konfigerUtil.isString(key)) {
        throw new Error("io.github.thecarisma.Konfiger: Invalid argument, key must be a string")
    }
    if (this.enableCache_) {
        if (this.currentCachedObject.ckey === key) {
            return this.currentCachedObject.cvalue
        }
        if (this.prevCachedObject.ckey === key) {
            return this.prevCachedObject.cvalue
        }
    }
    if (!this.contains(key) && this.lazyLoad) {
        if (!this.loadingEnds) {
            while (this.stream.hasNext()) {
                var obj = this.stream.next()
                this.konfigerObjects.set(obj[0], (this.stream.isEscaping() ? konfigerUtil.escapeString(obj[1], [this.seperator]) : obj[1] ))
                this.changesOccur = true
                if (obj[0] === key) {
                    if (this.enableCache_) {
                        this.shiftCache(key, obj[1])
                    }
                    return obj[1]
                }
            }
            this.loadingEnds = true
        }
    }
    if (defaultValue && !this.contains(key)) {
        return defaultValue
    }
    return this.konfigerObjects.get(key)
}

Konfiger.prototype.getString = function(key, defaultValue) {
    var value = this.get(key, defaultValue)
    return (value ? value.toString() : "")
}

Konfiger.prototype.getBoolean = function(key, defaultValue) {
    var value = this.get(key, defaultValue)
    return (value ? Boolean(value) : false)
}

Konfiger.prototype.getLong = function(key, defaultValue) {
    var value = this.get(key, defaultValue)
    return (value ? Number(value) : 0)
}

Konfiger.prototype.getInt = function(key, defaultValue) {
    return this.getLong(key, defaultValue)
}

Konfiger.prototype.getFloat = function(key, defaultValue) {
    var value = this.get(key, defaultValue)
    return (value ? parseFloat(value) : 0.0)
}

Konfiger.prototype.getDouble = function(key, defaultValue) {
    var value = this.get(key, defaultValue)
    return (value ? parseFloat(value) : 0.0)
}

Konfiger.prototype.shiftCache = function(key, value) {
	this.prevCachedObject =  this.currentCachedObject
    this.currentCachedObject = { ckey : key, cvalue : value }
}

Konfiger.prototype.enableCache = function(enableCache_) {
	if (!konfigerUtil.isBoolean(enableCache_)) {
        konfigerUtil.throwError("io.github.thecarisma.Konfiger", "invalid argument, expecting boolean found " 
                                + konfigerUtil.typeOf(enableCache_))
    }
    this.prevCachedObject = { ckey : "", cvalue : null }
    this.currentCachedObject = { ckey : "", cvalue : null }
    this.enableCache_ = enableCache_
}

Konfiger.prototype.contains = function(key) {
    return this.konfigerObjects.has(key)
}

Konfiger.prototype.keys = function(key) {
    this.toString()
    return this.konfigerObjects.keys()
}

Konfiger.prototype.values = function(key) {
    this.toString()
    return this.konfigerObjects.values()
}

Konfiger.prototype.entries = function() {
    this.toString()
    return this.konfigerObjects.entries()
}

Konfiger.prototype.clear = function() {
    this.changesOccur = true
    this.enableCache(this.enableCache_)
    this.konfigerObjects.clear()
}

Konfiger.prototype.remove = function(keyIndex) {
    if (konfigerUtil.isString(keyIndex)) {
        this.changesOccur = true
        this.enableCache(this.enableCache_)
        if (this.contains(keyIndex)) {
            var ret = this.get(keyIndex)
            if (this.konfigerObjects.delete(keyIndex)) {
                return ret
            }
            return ""
        }
        
    } else if (konfigerUtil.isNumber(keyIndex)) {
        if (keyIndex < this.konfigerObjects.size) {
            var i = -1
            for (let o of this.keys()) {
                ++i
                if (i === keyIndex) {
                    return this.remove(o)
                }
            }
            
        }
        return ""
        
    } else {
        throw new Error("io.github.thecarisma.Konfiger: Invalid argument, expecting the entry key(string) or index(Number) found " 
                        + konfigerUtil.typeOf(keyIndex))
    }
}

Konfiger.prototype.updateAt = function(index, value) {
    if (konfigerUtil.isNumber(index) && konfigerUtil.isString(value)) {
        if (index < this.konfigerObjects.size) {
            var i = -1
            for (let o of this.keys()) {
                ++i
                if (i === index) {
                    this.changesOccur = true
                    this.enableCache(this.enableCache_)
                    return this.konfigerObjects.set(o, value)
                }
            }            
        }
        return undefined
        
    } else {
        throw new Error("io.github.thecarisma.Konfiger: Invalid argument, expecting the entry (Number, String) found " 
                        + konfigerUtil.typeOf(index))
    }
}

Konfiger.prototype.size = function() {
    return this.konfigerObjects.size
}

Konfiger.prototype.isEmpty = function() {
    return this.konfigerObjects.size === 0
}

Konfiger.prototype.getSeperator = function() {
    return this.seperator
}

Konfiger.prototype.setSeperator = function(seperator) {
    if (!konfigerUtil.isChar(seperator)) {
        throw new Error("io.github.thecarisma.Konfiger: Invalid argument, expecting a character found " + 
                        konfigerUtil.typeOf(seperator))
    }
    if (this.seperator !== seperator) {
        this.changesOccur = true
        this.seperator = seperator
        for (var entry of this.entries()) {
            this.konfigerObjects.set(entry[0], (this.stream.isEscaping() ? konfigerUtil.escapeString(entry[1], [this.seperator]) : entry[1]))
        }
    }
}

Konfiger.prototype.getDelimeter = function() {
    return this.delimeter
}

Konfiger.prototype.setDelimeter = function(delimeter) {
    if (!konfigerUtil.isChar(delimeter)) {
        throw new Error("io.github.thecarisma.Konfiger: Invalid argument, expecting a character found " + 
                        konfigerUtil.typeOf(delimeter))
    }
    this.changesOccur = true
    this.delimeter = delimeter
}

Konfiger.prototype.errorTolerance = function(errTolerance) {
    this.stream.errTolerance = errTolerance
}

Konfiger.prototype.isErrorTolerant = function() {
	return this.stream.errTolerance
}

Konfiger.prototype.hashCode = function() {
	if (this.hashcode !== 0) return this.hashcode
	var i, chr
	if (this.stringValue.length === 0) return this.hashcode
	for (i = 0; i < this.stringValue.length; ++i) {
		chr   = this.stringValue.charCodeAt(i)
		this.hashcode  = ((this.hashcode << 5) - this.hashcode) + chr
		this.hashcode |= 0
	}
	return this.hashcode
}

Konfiger.prototype.toString = function() {
	if (this.changesOccur) {
        if (this.lazyLoad) {
            this.lazyLoader()
        }
        this.stringValue = ""
        var index = 0
        for (let entry of this.konfigerObjects.entries()) {
            this.stringValue += entry[0] + this.delimeter + (this.stream.isEscaping() ? konfigerUtil.escapeString(entry[1], [this.seperator]) : entry[1]) 
            if (index != (this.konfigerObjects.size - 1)) this.stringValue += this.seperator
            ++index
        }
		this.changesOccur = false
	}
	return this.stringValue
}

Konfiger.prototype.lazyLoader = function() {
    if (this.loadingEnds) {
        return
    }
    while (this.stream.hasNext()) {
        var obj = this.stream.next()
        this.putString(obj[0], (this.stream.isEscaping() ? konfigerUtil.escapeString(obj[1], [this.seperator]) : obj[1] ))
    }
    this.loadingEnds = true
}

Konfiger.prototype.save = function(filePath) {
	if (!this.filePath && !filePath) {
        throw new Error("io.github.thecarisma.Konfiger: The entries cannot be saved you need to specify the filePath as parameter or load Konfiger from a file")
    }
	if (!filePath) {
        filePath = this.filePath
    }
    var ret = fs.writeFileSync(filePath, this.toString())
    if(ret) {
        throw new Error("io.github.thecarisma.Konfiger: Error occur while saving entries into "
        + filePath)
    }
}

Konfiger.prototype.appendString = function(rawString, delimeter, seperator) {
	if (!rawString) {
        throw new Error("io.github.thecarisma.Konfiger: You must specified the string that contains the entries to append")
    }
    var stream_ = KonfigerStream.stringStream(rawString, (delimeter ? delimeter : this.delimeter), (seperator ? seperator : this.seperator))
    while (stream_.hasNext()) {
        var obj = stream_.next()
        this.putString(obj[0], (this.stream.isEscaping() ? konfigerUtil.escapeString(obj[1], [this.seperator]) : obj[1]))
    }
    this.changesOccur = true
}

Konfiger.prototype.appendFile = function(filePath, delimeter, seperator) {
	if (!filePath) {
        throw new Error("io.github.thecarisma.Konfiger: You must specified the file path that contains the entries to append")
    }
    if (!fs.existsSync(filePath)) {
        throw new Error("io.github.thecarisma.Konfiger: The file does not exists " + filePath)
    }  
    var stream_ = KonfigerStream.fileStream(filePath, (delimeter ? delimeter : this.delimeter), (seperator ? seperator : this.seperator))
    while (stream_.hasNext()) {
        var obj = stream_.next()
        this.putString(obj[0], (this.stream.isEscaping() ? konfigerUtil.escapeString(obj[1], [this.seperator]) : obj[1]))
    }
    this.changesOccur = true
    
}


module.exports = { 
    MAX_CAPACITY,
    fromFile,
    fromStream,
    fromString
}