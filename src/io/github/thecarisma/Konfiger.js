
/*
 * The MIT License
 *
 * Copyright 2020 Adewale Azeez <azeezadewale98@gmail.com>.
 *
 */
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
 
const konfigerUtil = require("./KonfigerUtil.js")
const KonfigerObject = require("./KonfigerObject.js")
const KonfigerStream = require("./KonfigerStream.js")
 
const MAX_CAPACITY = Number.MAX_SAFE_INTEGER - 1

function fromFile(filePath, delimeter, seperator) {
    return fromStream((new KonfigerStream(filePath, delimeter, seperator)))
}

function fromString(filePath, delimeter, seperator) {
    
}

function fromStream(konfigerStream) {
    const konfiger = new Konfiger(konfigerStream.delimeter, konfigerStream.seperator)
    konfiger.createdFromStream = true
    konfiger.stream = konfigerStream
    return konfiger
}

function Konfiger(delimeter, seperator) {
    this.stream = null
    this.createdFromStream = false
    this.konfigerObjects = new Map()
    this.delimeter = delimeter
    this.seperator = seperator
    this.errTolerance = false
    this.caseSensitive = true
    this.dbChanged = true
    
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
            this.konfigerObjects.set(key, JSON.stringify(value))
            this.dbChanged = true
            if (this.enableCache_) {
                this.shiftCache(key, value)
            }
        }
        
    } else {
        konfigerUtil.throwError("io.github.thecarisma.Konfiger", "invalid argument, key must be a string")
    }
}

Konfiger.prototype.get = function(key) {
    if (this.enableCache_) {
        if (this.currentCachedObject.ckey === key) {
            return this.currentCachedObject.cvalue
        }
        if (this.prevCachedObject.ckey === key) {
            return this.prevCachedObject
        }
        //TODO: maybe make the map value currentCache if not 
        //performance cost
    }
    return this.prevCachedObject.cvalue
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
    return konfigerUtil.isDefined(this.konfigerObjects.get(key))
}

module.exports = { 
    MAX_CAPACITY,
    fromFile
}