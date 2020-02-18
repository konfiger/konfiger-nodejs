
/*
 * The MIT License
 *
 * Copyright 2020 Adewale Azeez <azeezadewale98@gmail.com>.
 *
 */
const konfigerUtil = require("./KonfigerUtil.js")

function KonfigerObject(key, value) {
    if (key.length === 0) {
        konfigerUtil.throwError("io.github.thecarisma.KonfigerObject", "invalid argument, key cannot be empty") 
    }
	this.key = key.trim();
	this.value = value;
	this.hashcode = 0 ;
    this.hashCode()
}

KonfigerObject.prototype.getKey = function() {
    return this.key;
}

KonfigerObject.prototype.getValue = function() {
    return this.value;
}

KonfigerObject.prototype.setKey = function(key) {
    this.key = key.trim();
}

KonfigerObject.prototype.setValue = function(value) {
    this.value = value;
}

KonfigerObject.prototype.toString = function() {
    return "KonfigerObject@" + this.hashCode() + ":Key=" + this.key + ",Value=" + this.value;
}

KonfigerObject.prototype.hashCode = function() {
	if (this.hashcode !== 0) return this.hashcode ;
	var i, chr;
	if (this.key.length === 0) return this.hashcode;
	for (i = 0; i < this.key.length; i++) {
		chr   = this.key.charCodeAt(i);
		this.hashcode  = ((this.hashcode << 5) - this.hashcode) + chr;
		this.hashcode |= 0; 
	}
	return this.hashcode;
}

module.exports = KonfigerObject;