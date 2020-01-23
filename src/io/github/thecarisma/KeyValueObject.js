
/*
 * The MIT License
 *
 * Copyright 2019 Adewale Azeez <azeezadewale98@gmail.com>.
 *
 */

/**

*/
function KeyValueObject(key, value) {
	this.key = key.trim();
	this.value = value;
	this.hashcode = 0 ;
}

/**

*/
KeyValueObject.prototype.getKey = function() {
    return this.key;
};


/**

*/
KeyValueObject.prototype.getValue = function() {
    return this.value;
};

/**

*/
KeyValueObject.prototype.setKey = function(key) {
    this.key = key.trim();
};

/**

*/
KeyValueObject.prototype.setValue = function(value) {
    this.value = value;
};

/**

*/
KeyValueObject.prototype.toString = function() {
    return "KeyValueObject@" + this.hashCode() + ":Key=" + this.key + ",Value=" + this.value;
};

/**

*/
KeyValueObject.prototype.hashCode = function() {
	if (this.hashcode !== 0) return this.hashcode ;
	var i, chr;
	if (this.key.length === 0) return this.hashcode;
	for (i = 0; i < this.key.length; i++) {
		chr   = this.key.charCodeAt(i);
		this.hashcode  = ((this.hashcode << 5) - this.hashcode) + chr;
		this.hashcode |= 0; 
	}
	return this.hashcode;
};

/**

*/
module.exports = KeyValueObject;