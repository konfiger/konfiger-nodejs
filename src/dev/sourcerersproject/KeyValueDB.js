
/*
 * The MIT License
 *
 * Copyright 2019 Azeez Adewale <azeezadewale98@gmail.com>.
 *
 */
 
const KeyValueUtil = require("./KeyValueUtil.js");
const KeyValueObject = require("./KeyValueObject.js");
 
/**

*/
function KeyValueDB(keyValueDB, caseSensitive, delimeter, seperator, errTolerance) {
	this.hashcode = 0 ;
	this.stringValue = "" ;
	this.dbChanged = true ;
	this.keyValueObjects = [] ;
	//please reolve proper type check here
	if (KeyValueUtil.isDefined(errTolerance)) { 
		if (!KeyValueUtil.isString(keyValueDB)) { throw new Error('com.azeezadewale.KeyValueDB: The first argument has to be a string'); } 
		if (!KeyValueUtil.isBoolean(caseSensitive)) { throw new Error('com.azeezadewale.KeyValueDB: The second argument has to be a boolean'); } 
		if (!KeyValueUtil.isChar(delimeter)) { throw new Error('com.azeezadewale.KeyValueDB: The third argument has to be a char'); }  
		if (!KeyValueUtil.isChar(seperator)) { throw new Error('com.azeezadewale.KeyValueDB: The fourth argument has to be a char'); } 
		if (!KeyValueUtil.isBoolean(errTolerance)) { throw new Error('com.azeezadewale.KeyValueDB: The fifth argument has to be a boolean'); } 
		this.parse(keyValueDB, caseSensitive, delimeter, seperator, errTolerance);
		
	} else if (KeyValueUtil.isDefined(seperator)) { 
		if (!KeyValueUtil.isString(keyValueDB)) { throw new Error('com.azeezadewale.KeyValueDB: The first argument has to be a string'); } 
		if (!KeyValueUtil.isBoolean(caseSensitive)) { throw new Error('com.azeezadewale.KeyValueDB: The second argument has to be a boolean'); } 
		if (!KeyValueUtil.isChar(delimeter)) { throw new Error('com.azeezadewale.KeyValueDB: The third argument has to be a char'); }  
		if (!KeyValueUtil.isChar(seperator)) { throw new Error('com.azeezadewale.KeyValueDB: The fourth argument has to be a char'); } 
		this.parse(keyValueDB, caseSensitive, delimeter, seperator, false);
		
	} else if (KeyValueUtil.isDefined(delimeter)) { 
		if (!KeyValueUtil.isString(keyValueDB)) { throw new Error('com.azeezadewale.KeyValueDB: The first argument has to be a string'); } 
		if (!KeyValueUtil.isBoolean(caseSensitive)) { throw new Error('com.azeezadewale.KeyValueDB: The second argument has to be a boolean'); } 
		if (!KeyValueUtil.isChar(delimeter)) { throw new Error('com.azeezadewale.KeyValueDB: The third argument has to be a char'); } 
		this.parse(keyValueDB, caseSensitive, delimeter, '\n', false);
		
	} else if (KeyValueUtil.isDefined(caseSensitive)) { 
		if (!KeyValueUtil.isString(keyValueDB)) { throw new Error('com.azeezadewale.KeyValueDB: The first argument has to be a string'); } 
		if (!KeyValueUtil.isBoolean(caseSensitive)) { throw new Error('com.azeezadewale.KeyValueDB: The second argument has to be a boolean'); } 
		this.parse(keyValueDB, caseSensitive, '=', '\n', false);
		
	} else if (KeyValueUtil.isDefined(keyValueDB)) { 
		if (!KeyValueUtil.isString(keyValueDB)) { throw new Error('com.azeezadewale.KeyValueDB: The first argument has to be a string'); } 
		this.parse(keyValueDB, true, '=', '\n', false);
		
	} else { 
		this.parse("", true, '=', '\n', false);
	}
}

KeyValueDB.prototype[Symbol.iterator] = function() {
	var index = 0;
	var data  = this.keyValueObjects;

	return {
		next: function() {
			return { value: data[index++], done: index > data.length }
		}
	};
};

KeyValueDB.prototype.forEach = function() {
	var index = 0;
	var data  = this.keyValueObjects;

	return {
		next: function() {
			return { value: data[index++], done: index > data.length }
		}
	};
};

/**

*/
KeyValueDB.prototype.getKeyValueObject = function(indexKey, defaultKeyValueObject) {
	if (KeyValueUtil.isNumber(indexKey) && !KeyValueUtil.isDefined(defaultKeyValueObject)) { 
		if (indexKey >= this.keyValueObjects.length) {
			throw new Error('com.azeezadewale.KeyValueDB.getKeyValueObject: Array index out of bound');
		}
		return this.keyValueObjects[indexKey];
		
	} else if (KeyValueUtil.isString(indexKey) && !KeyValueUtil.isDefined(defaultKeyValueObject)) {
		indexKey = ((this.isCaseSensitive) ? indexKey : indexKey.toLowerCase()) ;
		for (var i = 0; i < this.keyValueObjects.length; i++) {
			if (this.keyValueObjects[i].getKey() === indexKey) {
				return this.keyValueObjects[i];
			}
		}
		return new KeyValueObject("","");
		
	}  else if (KeyValueUtil.isString(indexKey) && KeyValueUtil.isDefined(defaultKeyValueObject)) {
		try {
			defaultKeyValueObject.getKey()
		} catch (err) {
			throw new Error('com.azeezadewale.KeyValueDB.getKeyValueObject: Expecting a KeyValueObject as second argument ');
		}
		
		indexKey = ((this.isCaseSensitive) ? indexKey : indexKey.toLowerCase()) ;
		for (var i = 0; i < this.keyValueObjects.length; i++) {
			if (this.keyValueObjects[i].getKey() === indexKey) {
				return this.keyValueObjects[i];
			}
		}
		return defaultKeyValueObject;
		
	} else {
		throw new Error("com.azeezadewale.KeyValueDB.getKeyValueObject: Expecting a 'number or string' as the argument found '" + KeyValueUtil.typeOf(indexKey) + "' instead");
	}
}

/**

*/
KeyValueDB.prototype.getLikeKeyValueObject = function(indexKey, defaultKeyValueObject) {
	if (KeyValueUtil.isString(indexKey) && !KeyValueUtil.isDefined(defaultKeyValueObject)) {
		indexKey = ((this.isCaseSensitive) ? indexKey : indexKey.toLowerCase()) ;
		for (var i = 0; i < this.keyValueObjects.length; i++) {
			if (this.keyValueObjects[i].getKey().indexOf(indexKey) > -1) {
				return this.keyValueObjects[i];
			}
		}
		return new KeyValueObject("","");
		
	}  else if (KeyValueUtil.isString(indexKey) && KeyValueUtil.isDefined(defaultKeyValueObject)) {
		try {
			defaultKeyValueObject.getKey()
		} catch (err) {
			throw new Error('com.azeezadewale.KeyValueDB.getKeyValueObject: Expecting a KeyValueObject as second argument ');
		}
		
		indexKey = ((this.isCaseSensitive) ? indexKey : indexKey.toLowerCase()) ;
		for (var i = 0; i < this.keyValueObjects.length; i++) {
			if (this.keyValueObjects[i].getKey().indexOf(indexKey) > -1) {
				return this.keyValueObjects[i];
			}
		}
		return defaultKeyValueObject;
		
	} else {
		throw new Error("com.azeezadewale.KeyValueDB.getLikeKeyValueObject: Expecting a 'string' as the argument found '" + KeyValueUtil.typeOf(indexKey) + "' instead");
	}
}

/**

*/
KeyValueDB.prototype.get = function(indexKey, defaultValue) {
	if (KeyValueUtil.isNumber(indexKey) && !KeyValueUtil.isDefined(defaultValue)) { 
		if (indexKey >= this.keyValueObjects.length) {
			throw new Error('com.azeezadewale.KeyValueDB.get: Array index out of bound');
		}
		return this.keyValueObjects[indexKey].getValue();
		
	} else if (KeyValueUtil.isString(indexKey) && !KeyValueUtil.isDefined(defaultValue)) {
		indexKey = ((this.isCaseSensitive) ? indexKey : indexKey.toLowerCase()) ;
		for (var i = 0; i < this.keyValueObjects.length; i++) {
			if (this.keyValueObjects[i].getKey() === indexKey) {
				return this.keyValueObjects[i].getValue();
			}
		}
		return "";
		
	}  else if (KeyValueUtil.isString(indexKey) && KeyValueUtil.isString(defaultValue)) {
		indexKey = ((this.isCaseSensitive) ? indexKey : indexKey.toLowerCase()) ;
		for (var i = 0; i < this.keyValueObjects.length; i++) {
			if (this.keyValueObjects[i].getKey() === indexKey) {
				return this.keyValueObjects[i].getValue();
			}
		}
		return defaultValue;
		
	}   else if (KeyValueUtil.isString(indexKey) && KeyValueUtil.isDefined(defaultValue)) {
		try {
			defaultValue.getKey()
		} catch (err) {
			throw new Error('com.azeezadewale.KeyValueDB.get: Expecting a KeyValueObject as second argument ');
		}
		
		indexKey = ((this.isCaseSensitive) ? indexKey : indexKey.toLowerCase()) ;
		for (var i = 0; i < this.keyValueObjects.length; i++) {
			if (this.keyValueObjects[i].getKey() === indexKey) {
				return this.keyValueObjects[i].getValue();
			}
		}
		return defaultValue.getValue();
		
	} else {
		throw new Error("com.azeezadewale.KeyValueDB.get: Expecting a (number|string, KeyValueObject|string) as the argument found (" + KeyValueUtil.typeOf(indexKey) + ", " + KeyValueUtil.typeOf(defaultValue) + ") instead");
	}
}

/**

*/
KeyValueDB.prototype.getLike = function(indexKey, defaultValue) {
	if (KeyValueUtil.isString(indexKey) && !KeyValueUtil.isDefined(defaultValue)) {
		indexKey = ((this.isCaseSensitive) ? indexKey : indexKey.toLowerCase()) ;
		for (var i = 0; i < this.keyValueObjects.length; i++) {
			if (this.keyValueObjects[i].getKey().indexOf(indexKey) > -1) {
				return this.keyValueObjects[i].getValue();
			}
		}
		return "";
		
	}  else if (KeyValueUtil.isString(indexKey) && KeyValueUtil.isString(defaultValue)) {
		indexKey = ((this.isCaseSensitive) ? indexKey : indexKey.toLowerCase()) ;
		for (var i = 0; i < this.keyValueObjects.length; i++) {
			if (this.keyValueObjects[i].getKey().indexOf(indexKey) > -1) {
				return this.keyValueObjects[i].getValue();
			}
		}
		return defaultValue;
		
	}   else if (KeyValueUtil.isString(indexKey) && KeyValueUtil.isDefined(defaultValue)) {
		try {
			defaultValue.getKey()
		} catch (err) {
			throw new Error('com.azeezadewale.KeyValueDB.get: Expecting a KeyValueObject as second argument ');
		}
		
		indexKey = ((this.isCaseSensitive) ? indexKey : indexKey.toLowerCase()) ;
		for (var i = 0; i < this.keyValueObjects.length; i++) {
			if (this.keyValueObjects[i].getKey().indexOf(indexKey) > -1) {
				return this.keyValueObjects[i].getValue();
			}
		}
		return defaultValue.getValue();
		
	} else {
		throw new Error("com.azeezadewale.KeyValueDB.getLike: Expecting a (string, KeyValueObject|string) as the argument found (" + KeyValueUtil.typeOf(indexKey) + ", " + KeyValueUtil.typeOf(defaultValue) + ") instead");
	}
}

/**

*/
KeyValueDB.prototype.set = function(indexKey, value) {
	if (KeyValueUtil.isNumber(indexKey) && KeyValueUtil.isString(value)) { 
		if (indexKey >= this.keyValueObjects.length) {
			throw new Error('com.azeezadewale.KeyValueDB.set: Array index out of bound');
		}
		this.dbChanged = true ;
		this.keyValueObjects[indexKey].setValue(value);
		
	} else if (KeyValueUtil.isString(indexKey) && KeyValueUtil.isString(value)) { 
		indexKey = ((this.isCaseSensitive) ? indexKey : indexKey.toLowerCase()) ;
		for (var i = 0; i < this.keyValueObjects.length; i++) {
			if (this.keyValueObjects[i].getKey() === indexKey) {
				this.dbChanged = true ;
				this.keyValueObjects[i].setValue(value);
				return;
			}
		}
		this.add(indexKey, value);
		
	} else {
		throw new Error("com.azeezadewale.KeyValueDB.set: Expecting a (number|string, string) as the argument found (" + KeyValueUtil.typeOf(indexKey) + ", " + KeyValueUtil.typeOf(value) + ") instead");
	}
}

/**

*/
KeyValueDB.prototype.setKeyValueObject = function(indexKey, value) {
	if (KeyValueUtil.isNumber(indexKey) && KeyValueUtil.isDefined(value)) {
		if (indexKey >= this.keyValueObjects.length) {
			throw new Error('com.azeezadewale.KeyValueDB.setKeyValueObject: Array index out of bound');
		} 
		this.dbChanged = true ;
		this.keyValueObjects[indexKey] = value;
		
	} else if (KeyValueUtil.isString(indexKey) && KeyValueUtil.isDefined(value)) { 
		try {
			value.getKey()
		} catch (err) {
			throw new Error('com.azeezadewale.KeyValueDB.setKeyValueObject: Expecting a KeyValueObject as second argument ');
		}
		
		indexKey = ((this.isCaseSensitive) ? indexKey : indexKey.toLowerCase()) ;
		for (var i = 0; i < this.keyValueObjects.length; i++) {
			if (this.keyValueObjects[i].getKey() === indexKey) {
				this.dbChanged = true ;
				this.keyValueObjects[i] = value;
				return;
			}
		}
		this.add(value);
		
	} else {
		throw new Error("com.azeezadewale.KeyValueDB.setKeyValueObject: Expecting a (number|string, KeyValueObject) as the argument found (" + KeyValueUtil.typeOf(indexKey) + ", " + KeyValueUtil.typeOf(value) + ") instead");
	}
}

/**

*/
KeyValueDB.prototype.add = function(keyValueObjectKey, value) {
	if (KeyValueUtil.isString(keyValueObjectKey) && KeyValueUtil.isString(value)) { 
		keyValueObjectKey = ((this.isCaseSensitive) ? keyValueObjectKey : keyValueObjectKey.toLowerCase()) ;
        if (this.get(keyValueObjectKey) !== "") {
            this.set(keyValueObjectKey, value);
            return;
        }
        this.keyValueObjects.push(new KeyValueObject(keyValueObjectKey, value));
        this.dbChanged = true ;
		
	} else if (KeyValueUtil.isObject(keyValueObjectKey) && !KeyValueUtil.isDefined(value)) { 
		try {
			keyValueObjectKey.getKey()
		} catch (err) {
			throw new Error('com.azeezadewale.KeyValueDB.add: Expecting a KeyValueObject as first and only argument ');
		}
		
		if (this.get(((this.isCaseSensitive) ? keyValueObjectKey.getKey() : keyValueObjectKey.getKey().toLowerCase())) !== "") {
            this.setKeyValueObject(((this.isCaseSensitive) ? keyValueObjectKey.getKey() : keyValueObjectKey.getKey().toLowerCase()), keyValueObjectKey);
            return;
        }
        this.keyValueObjects.push(keyValueObjectKey);
        this.dbChanged = true ;
		
	} else {
		throw new Error("com.azeezadewale.KeyValueDB.add: Expecting a (string|KeyValueObject[, string]) as the argument found (" + KeyValueUtil.typeOf(keyValueObjectKey) + "[, " + KeyValueUtil.typeOf(value) + "]) instead");
	}
}

/**

*/
KeyValueDB.prototype.remove = function(indexKey) {
	if (KeyValueUtil.isNumber(indexKey)) {
		if (indexKey >= this.keyValueObjects.length) {
			throw new Error('com.azeezadewale.KeyValueDB.setKeyValueObject: Array index out of bound');
		}
		this.dbChanged = true ;
		return this.keyValueObjects.splice(indexKey, 1);
		
	} else if (KeyValueUtil.isString(indexKey)) {
		indexKey = ((this.isCaseSensitive) ? indexKey : indexKey.toLowerCase()) ;
		for (var i = 0; i < this.keyValueObjects.length; i++) {
			if (this.keyValueObjects[i].getKey() === indexKey) {
				this.dbChanged = true ;
				return this.keyValueObjects.splice(i, 1);
			}
		}
		return new KeyValueObject("","");
		
	} else {
		throw new Error("com.azeezadewale.KeyValueDB.remove: Expecting a (string|number) as the argument found (" + KeyValueUtil.typeOf(indexKey) + ") instead");
	}
}

/**

*/
KeyValueDB.prototype.parse = function(keyValueDB, caseSensitive, delimeter, seperator, errTolerance) {
	this.delimeter = delimeter ;
	this.seperator = seperator ;
	this.isCaseSensitive = caseSensitive ;
	var characters = keyValueDB.replace(/[\r]+/g, '').split('');
	var key = "" ;
	var value = "" ;
	var parseKey = true;
    var line = 1;
	var column = 0;
	var i = 0;
	for (; i <= characters.length; i++) {
		if (i == characters.length) {
			if (key !== "") {
				if (key === "" && value === "") continue;
				if (parseKey === true && errTolerance === false) throw new Error("com.azeezadewale.KeyValueDB: Invalid entry detected near Line " + line + ":" + column);
				this.keyValueObjects.push(new KeyValueObject(key, value));
			}
			break;
		}
		var character = characters[i];
		column++;
		if (character === '\n') {
			line++;
			column = 0 ;
		}
		if (character === seperator) {
			if (key === "" && value ==="") continue;
			if (parseKey === true && errTolerance === false) throw new Error("com.azeezadewale.KeyValueDB: Invalid entry detected near Line " + line + ":" + column);
			this.keyValueObjects.push(new KeyValueObject(key, value));
			parseKey = true ;
			key = "";
			value = "";
			continue;
		}
		if (character === delimeter) {
			if (value !== "" && errTolerance !== false)  throw new Error("com.azeezadewale.KeyValueDB: The input is imporperly sepreated near Line " + line + ":" + column+". Check the separator");
			parseKey = false ;
			continue;
		}
		if (parseKey) {
			key += (((caseSensitive)) ? character : (character).toLowerCase());
		} else {
			value += (character);
		}
	}
    toString();
};

/**

*/
KeyValueDB.prototype.toString = function() {
	if (this.dbChanged) {
		this.stringValue = "" ;
		for (var i = 0; i < this.keyValueObjects.length; i++) {
			this.stringValue += this.keyValueObjects[i].getKey() + this.delimeter + this.keyValueObjects[i].getValue() ;
			if (i != (this.keyValueObjects.length - 1)) this.stringValue += this.seperator;
		}
		this.dbChanged = false ;
	}
	return this.stringValue;
};

/**

*/
KeyValueDB.prototype.size = function() {
	return this.keyValueObjects.length;
};

/**

*/
KeyValueDB.prototype.clear = function() {
	this.keyValueObjects = [];
};

/**

*/
KeyValueDB.prototype.isEmpty = function() {
	return this.keyValueObjects.length === 0;
};

/**

*/
KeyValueDB.prototype.hashCode = function() {
	if (this.hashcode !== 0) return this.hashcode ;
	var i, chr;
	if (this.stringValue.length === 0) return this.hashcode;
	for (i = 0; i < this.stringValue.length; i++) {
		chr   = this.stringValue.charCodeAt(i);
		this.hashcode  = ((this.hashcode << 5) - this.hashcode) + chr;
		this.hashcode |= 0; 
	}
	return this.hashcode;
};

/**

*/
module.exports = KeyValueDB;