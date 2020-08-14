
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
    var kon = fromStream(KonfigerStream.fileStream(filePath, delimeter, seperator), lazyLoad)
    kon.filePath = kon.stream.streamObj
    return kon
}

function fromString(rawString, lazyLoad, delimeter, seperator) {
    return fromStream(KonfigerStream.stringStream(rawString, delimeter, seperator), lazyLoad)
}

function fromStream(konfigerStream, lazyLoad) {
    if (!konfigerUtil.isBoolean(lazyLoad)) {
        lazyLoad = true
    }
    return (new Konfiger(konfigerStream, lazyLoad))
}

function Konfiger(stream, lazyLoad) {
    this.hashcode = 0
    this.stream = stream
    this.loadingEnds = false
    this.lazyLoad = lazyLoad
    this.konfigerObjects = new Map()
    this.delimeter = stream.delimeter
    this.seperator = stream.seperator
    this.caseSensitive = true
    this.changesOccur = true
    this.stringValue = ""
    this.readIndex = 0
    this.filePath = undefined
    this.attachedResolveObj = undefined
    
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
        if (this.attachedResolveObj) {
            var findKey
            if ((this.attachedResolveObj.matchPutKey && !(findKey = this.attachedResolveObj.matchPutKey(key))) || 
                (!this.attachedResolveObj.matchPutKey)) {
                    
                findKey = key
            }
            if (!konfigerUtil.isFunction(this.attachedResolveObj[findKey]) && this.attachedResolveObj[findKey] !== undefined ) {
                this.attachedResolveObj[findKey] = value
            }
        }
    
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
    if (this.lazyLoad && !this.loadingEnds && this.konfigerObjects.has(key)) {
        var _value = this.getString(key)
        if (_value === value) {
            return
        }
    }
    if (!this.konfigerObjects.has(key)) {
        if (this.konfigerObjects.size >= MAX_CAPACITY) {
            throw new Error("io.github.thecarisma.Konfiger: Konfiger has reached it maximum capacity " + MAX_CAPACITY)
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
    if (!this.konfigerObjects.has(key) && this.lazyLoad) {
        if (!this.loadingEnds) {
            this.changesOccur = true
            while (this.stream.hasNext()) {
                var obj = this.stream.next()
                this.konfigerObjects.set(obj[0], obj[1])
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
    var value
    if (this.caseSensitive === false) {
        for (entryKey of this.keys()) {
            if (entryKey.toLowerCase() === key.toLowerCase()) {
                key = entryKey
                break
            }
        }
    }
    if (defaultValue && !this.konfigerObjects.has(key)) {
        value = ""+defaultValue
    } else if (this.konfigerObjects.has(key)) {
        value = this.konfigerObjects.get(key)
        if (this.enableCache_) {
            this.shiftCache(key, value)
        }
    }
    return value
}

Konfiger.prototype.getString = function(key, defaultValue) {
    var value = this.get(key, defaultValue)
    return (value ? value.toString() : "")
}

Konfiger.prototype.getBoolean = function(key, defaultValue) {
    var value = this.get(key, defaultValue)
    return (value ? value.toLowerCase() === "true" : false)
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
    if (!konfigerUtil.isString(key)) {
        throw new Error("io.github.thecarisma.Konfiger: Invalid argument, key must be a string")
    }
    
    if (this.konfigerObjects.has(key)) {
        return true
    }
    if (!this.loadingEnds && this.lazyLoad === true) {
        this.changesOccur = true
        while (this.stream.hasNext()) {
            var obj = this.stream.next()
            this.konfigerObjects.set(obj[0], obj[1])
            if (obj[0] === key) {
                return true
            }
        }
        this.loadingEnds = true
    }
    return false
}

Konfiger.prototype.keys = function(key) {
    if (!this.loadingEnds && this.lazyLoad === true) {
        this.lazyLoader()
    }
    return this.konfigerObjects.keys()
}

Konfiger.prototype.values = function() {
    if (!this.loadingEnds && this.lazyLoad === true) {
        this.lazyLoader()
    }
    return this.konfigerObjects.values()
}

Konfiger.prototype.entries = function() {
    if (!this.loadingEnds && this.lazyLoad === true) {
        this.lazyLoader()
    }
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
        if (this.konfigerObjects.has(keyIndex)) {
            enableCache_ = this.enableCache_
            this.enableCache(false)
            var ret = this.get(keyIndex)
            this.enableCache(enableCache_)
            if (this.konfigerObjects.delete(keyIndex)) {
                return ret
            }
            return undefined
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
        return undefined
        
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
                    this.konfigerObjects.set(o, value)
                    break
                }
            }            
        }
        
    } else {
        throw new Error("io.github.thecarisma.Konfiger: Invalid argument, expecting the entry (Number, String) found (" 
                        + konfigerUtil.typeOf(index) + "," + konfigerUtil.typeOf(value) + ")")
    }
}

Konfiger.prototype.size = function() {
    if (!this.loadingEnds && this.lazyLoad === true) {
        this.lazyLoader()
    }
    return this.konfigerObjects.size
}

Konfiger.prototype.isEmpty = function() {
    return this.size() === 0
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
		oldSeperator = this.seperator
        this.seperator = seperator
        for (var entry of this.entries()) {
			this.konfigerObjects.set(entry[0], konfigerUtil.unEscapeString(entry[1], [seperator]))
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

Konfiger.prototype.isCaseSensitive = function() {
    return this.caseSensitive
}

Konfiger.prototype.setCaseSensitivity = function(caseSensitive) {
    if (!konfigerUtil.isBoolean(caseSensitive)) {
        throw new Error("io.github.thecarisma.Konfiger: Invalid argument, expecting a boolean found " + 
                        konfigerUtil.typeOf(caseSensitive))
    }
    this.caseSensitive = caseSensitive
}

Konfiger.prototype.hashCode = function() {
	if (this.hashcode !== 0) return this.hashcode
	var i, chr
	if (this.stringValue.length === 0) { 
        this.stringValue = self.toString()
    }
	for (i = 0; i < this.stringValue.length; ++i) {
		chr   = this.stringValue.charCodeAt(i)
		this.hashcode  = ((this.hashcode << 5) - this.hashcode) + chr
		this.hashcode |= 0
	}
	return this.hashcode
}

Konfiger.prototype.toString = function() {
	if (this.changesOccur) {
        if (!this.loadingEnds && this.lazyLoad === true) {
            this.lazyLoader()
        }
        this.stringValue = ""
        var index = 0
        for (let entry of this.konfigerObjects.entries()) {
            if (!entry[1]) { continue }
            this.stringValue += entry[0] + this.delimeter + konfigerUtil.escapeString(entry[1], [this.seperator])
            ++index
            if (index < (this.konfigerObjects.size)) this.stringValue += this.seperator
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
        this.putString(obj[0], obj[1])
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
        this.putString(obj[0], obj[1])
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
        this.putString(obj[0], obj[1])
    }
    this.changesOccur = true
    
}

Konfiger.prototype.resolve = function(obj) {
    if (!konfigerUtil.isObject(obj)) {
        konfigerUtil.throwError("io.github.thecarisma.Konfiger", "invalid argument, expecting an object found " 
                                + konfigerUtil.typeOf(obj))
    }
	this.attachedResolveObj = obj
    for (var key in this.attachedResolveObj) {
        if (konfigerUtil.isFunction(this.attachedResolveObj[key])) {
            continue
        }
        var findKey
        if ((this.attachedResolveObj.matchGetKey && !(findKey = this.attachedResolveObj.matchGetKey(key))) || 
            (!this.attachedResolveObj.matchGetKey)) {
            findKey = key
        }
        if (this.contains(findKey)) {
            if (konfigerUtil.isString(this.attachedResolveObj[key])) {
                this.attachedResolveObj[key] = this.get(findKey)
                
            } else if (konfigerUtil.isBoolean(this.attachedResolveObj[key])) {
                this.attachedResolveObj[key] = this.getBoolean(findKey)
                
            } else if (konfigerUtil.isFloat(this.attachedResolveObj[key])) {
                this.attachedResolveObj[key] = this.getFloat(findKey)
                
            } else if (konfigerUtil.isNumber(this.attachedResolveObj[key])) {
                this.attachedResolveObj[key] = this.getLong(findKey)
                
            }
        }        
    }
}

Konfiger.prototype.dissolve = function(obj) {
    if (!konfigerUtil.isObject(obj)) {
        konfigerUtil.throwError("io.github.thecarisma.Konfiger", "invalid argument, expecting an object found " 
                                + konfigerUtil.typeOf(obj))
    }
    for (var key in obj) {
        if (konfigerUtil.isFunction(obj[key])) {
            continue
        }
        var findKey
        if ((obj.matchGetKey && !(findKey = obj.matchGetKey(key))) || 
            (!obj.matchGetKey)) {
                
            findKey = key
        }
        if (obj[key]) {
            this.konfigerObjects.set(findKey, ""+obj[key])
        }
      
    }
}

Konfiger.prototype.detach = function() {
	var tmpObj = this.attachedResolveObj
    this.attachedResolveObj = undefined
	return tmpObj
}


module.exports = { 
    MAX_CAPACITY,
    fromFile,
    fromStream,
    fromString
}