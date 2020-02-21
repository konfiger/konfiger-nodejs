
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
    return fromStream(new KonfigerStream(filePath, delimeter, seperator), lazyLoad)
}

function fromString(rawString, lazyLoad, delimeter, seperator) {
    if (!konfigerUtil.isBoolean(lazyLoad)) {
        throw new Error("io.github.thecarisma.Konfiger: Invalid argument, the second parameter must be a Boolean")
    }
    if (delimeter) {
        if (!konfigerUtil.isChar(delimeter)) {
            throw new Error("io.github.thecarisma.Konfiger: Invalid argument, expecting a character for the delimeter value")
        }
        if (!konfigerUtil.isChar(seperator)) {
            throw new Error("io.github.thecarisma.Konfiger: Invalid argument, expecting a character for the seperator value")
        }
    } else {
        delimeter = '='
        seperator = '\n'
    }
    const konfiger = new Konfiger(delimeter, seperator, lazyLoad, false, undefined, rawString)
    return konfiger
}

function fromStream(konfigerStream, lazyLoad) {
    const konfiger = new Konfiger(konfigerStream.delimeter, konfigerStream.seperator, lazyLoad, true, konfigerStream, undefined)
    konfiger.filePath = konfigerStream.filePath
    return konfiger
}

function Konfiger(delimeter, seperator, lazyLoad, createdFromStream, stream, rawString) {
    this.hashcode = 0
    this.stream = stream
    this.rawString = rawString
    this.createdFromStream = createdFromStream
    this.loadingEnds = false
    this.lazyLoad = (lazyLoad ? lazyLoad : false)
    this.konfigerObjects = new Map()
    this.delimeter = delimeter
    this.seperator = seperator
    this.errTolerance = false
    this.caseSensitive = true
    this.changesOccur = true
    this.stringValue = ""
    this.kArray = []
    this.readIndex = 0
    this.filePath = undefined
    
    if (!this.lazyLoad) {
        this.lazyLoader()
    }
    
    this.enableCache_ = true
    this.prevCachedObject = { ckey : "", cvalue : null }
    this.currentCachedObject = { ckey : "", cvalue : null }
}

/*Konfiger.prototype[Symbol.iterator] = function() {
	var index = 0
	var data  = this.konfigerObjects

	return {
		next: function() {
			return { value: data[index++], done: index > data.length }
		}
	}
}

Konfiger.prototype.forEach = function() {
	var index = 0
	var data  = this.konfigerObjects

	return {
		next: function() {
			return { value: data[index++], done: index > data.length }
		}
	}
}*/

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
    if (this.konfigerObjects.size === MAX_CAPACITY) {
        throw new Error("io.github.thecarisma.Konfiger: Konfiger has reached it maximum capacity 10,000,000")
    }
    if (!konfigerUtil.isString(key)) {
        throw new Error("io.github.thecarisma.Konfiger: Invalid argument, key must be a string")
    }
    if (!konfigerUtil.isString(value)) {
        throw new Error("io.github.thecarisma.Konfiger: invalid argument, expecting String found " + konfigerUtil.typeOf(value))
    }
    if (this.lazyLoad && !this.loadingEnds && !this.contains(key)) {
        var _value = this.getString(key)
        if (_value === value) {
            return
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
            if (this.createdFromStream) {
                while (this.stream.hasNext()) {
                    var obj = this.stream.next()
                    this.konfigerObjects.set(obj[0], konfigerUtil.escapeString(obj[1], [this.seperator]))
                    this.changesOccur = true
                    if (obj[0] === key) {
                        if (this.enableCache_) {
                            this.shiftCache(key, obj[1])
                        }
                        return obj[1]
                    }
                }
                this.loadingEnds = true
            } else {
                var subkey = ""
                var value = ""
                var parseKey = true
                var line = 1
                var column = 0
                for (; this.readIndex <= this.rawString.length; ++this.readIndex) {
                    if (this.readIndex == this.rawString.length) {
                        this.rawString = ""
                        if (subkey !== "") {
                            if (parseKey === true && this.errTolerance === false) {
                                this.loadingEnds = true
                                throw new Error("io.github.thecarisma.Konfiger: Invalid entry detected near Line " + line + ":" + column);
                            }
                            this.konfigerObjects.set(subkey, value)
                            this.changesOccur = true
                            if (subkey === key) {
                                if (this.enableCache_) {
                                    this.shiftCache(key, value)
                                }
                                this.loadingEnds = true
                                return value
                            }
                        }
                        this.loadingEnds = true
                        break
                    }
                    var character = this.rawString[this.readIndex];
                    column++;
                    if (character === '\n') {
                        line++;
                        column = 0 
                    }
                    if (character === this.seperator && this.rawString[this.readIndex-1] != '\\') {
                        if (subkey === "" && value ==="") continue
                        if (parseKey === true && this.errTolerance === false) {
                            this.loadingEnds = true
                            throw new Error("io.github.thecarisma.Konfiger: Invalid entry detected near Line " + line + ":" + column);
                        }
                        this.konfigerObjects.set(subkey, value)
                        this.changesOccur = true
                        if (subkey === key) {
                            if (this.enableCache_) {
                                this.shiftCache(key, value)
                            }
                            return value
                        }
                        parseKey = true 
                        subkey = "";
                        value = "";
                        continue
                    }
                    if (character === this.delimeter) {
                        if (value !== "" && this.errTolerance !== false) {
                            this.loadingEnds = true
                            throw new Error("io.github.thecarisma.Konfiger: The input is imporperly sepreated near Line " + line + ":" + column+". Check the separator");
                        }
                        parseKey = false 
                        continue
                    }
                    if (parseKey) {
                        subkey += character
                    } else {
                        value += character
                    }
                }
            }
        }
    }
    if (defaultValue && !this.contains(key)) {
        return defaultValue
    }
    return this.konfigerObjects.get(key)
}

Konfiger.prototype.getString = function(key, defaultValue) {
    var value = this.get(key, defaultValue)
    return (value ? value.toString() : value)
}

Konfiger.prototype.getBoolean = function(key, defaultValue) {
    var value = this.get(key, defaultValue)
    return (value ? Boolean(value) : value)
}

Konfiger.prototype.getLong = function(key, defaultValue) {
    var value = this.get(key, defaultValue)
    return (value ? Number(value) : value)
}

Konfiger.prototype.getInt = function(key, defaultValue) {
    return this.getLong(key, defaultValue)
}

Konfiger.prototype.getFloat = function(key, defaultValue) {
    var value = this.get(key, defaultValue)
    return (value ? parseFloat(value) : value)
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
        return this.konfigerObjects.delete(keyIndex)
    } else if (konfigerUtil.isNumber(keyIndex)) {
        if (keyIndex < this.konfigerObjects.size) {
            var i = -1
            for (let o of this.keys()) {
                ++i
                if (i === keyIndex) {
                    this.changesOccur = true
                    this.enableCache(this.enableCache_)
                    return this.remove(o)
                }
            }
            
        }
        return false
        
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
    this.changesOccur = true
    this.seperator = seperator
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
	if (!konfigerUtil.isBoolean(enableCache_)) {
        konfigerUtil.throwError("io.github.thecarisma.Konfiger", "invalid argument, expecting boolean found " 
                                + konfigerUtil.typeOf(errTolerance))
    }
    this.errTolerance = errTolerance
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
            this.stringValue += entry[0] + this.delimeter + konfigerUtil.escapeString(entry[1], [this.seperator]) 
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
    if (this.createdFromStream) {
        while (this.stream.hasNext()) {
            var obj = this.stream.next()
            this.putString(obj[0], konfigerUtil.escapeString(obj[1], [this.seperator]))
        }
        this.loadingEnds = true
    } else {
        var key = ""
        var value = ""
        var parseKey = true
        var line = 1
        var column = 0
        for (; this.readIndex <= this.rawString.length; ++this.readIndex) {
            if (this.readIndex == this.rawString.length) {
                this.rawString = ""
                if (key !== "") {
                    if (parseKey === true && this.errTolerance === false) {
                        this.loadingEnds = true
                        throw new Error("io.github.thecarisma.Konfiger: Invalid entry detected near Line " + line + ":" + column)
                    }
                    this.putString(key, konfigerUtil.unEscapeString(value, [this.seperator]))
                }
                this.loadingEnds = true
                break
            }
            var character = this.rawString[this.readIndex]
            column++;
            if (character === '\n') {
                line++;
                column = 0 
            }
            if (character === this.seperator && this.rawString[this.readIndex-1] != '\\') {
                if (key === "" && value ==="") continue
                if (parseKey === true && this.errTolerance === false) {
                    this.loadingEnds = true
                    throw new Error("io.github.thecarisma.Konfiger: Invalid entry detected near Line " + line + ":" + column);
                }
                this.putString(key, konfigerUtil.unEscapeString(value, [this.seperator]))
                parseKey = true 
                key = "";
                value = ""
                continue
            }
            if (character === this.delimeter && parseKey) {
                if (value !== "" && this.errTolerance !== false) {
                    this.loadingEnds = true
                    throw new Error("io.github.thecarisma.Konfiger: The input is imporperly sepreated near Line " + line + ":" + column+". Check the separator")
                }
                parseKey = false 
                continue
            }
            if (parseKey) {
                key += character
            } else {
                value += character
            }
        }
    }
}

Konfiger.prototype.save = function(filePath) {
	if (!this.filePath && !filePath) {
        throw new Error("io.github.thecarisma.Konfiger: The entries cannot be saved you need to specify the filePath as parameter or load Konfiger from a file")
    }
	if (!filePath) {
        filePath = this.filePath
    }
    fs.writeFile(filePath, this.toString(), function(err) {
        if(err) {
            throw new Error("io.github.thecarisma.Konfiger: Error occur while saving entries into "
            + filePath)
        }
    })
}



module.exports = { 
    MAX_CAPACITY,
    fromFile,
    fromStream,
    fromString
}