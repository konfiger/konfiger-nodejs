
/*
 * The MIT License
 *
 * Copyright 2020 Adewale Azeez <azeezadewale98@gmail.com>.
 *
 */

var KonfigerListener = function() {
    if (this.constructor === KonfigerListener) {
      throw new Error("Can't instantiate abstract class! - KonfigerListener");
    }
};

/**
 @abstract
 */
KonfigerListener.prototype.onValueAdded = function(object, key) {
    throw new Error("Abstract method!, simply implements the abstract method - onValueAdded");
}

/**
 @abstract
 */
KonfigerListener.prototype.onChange = function(object) {
    throw new Error("Abstract method!, simply implements the abstract method - onChange");
}

/**
 @abstract
 */
KonfigerListener.prototype.onValueChanged = function(object, key, oldValue, newValue) {
    throw new Error("Abstract method!, simply implements the abstract method - onValueChanged");
}

/**
 @abstract
 */
KonfigerListener.prototype.onValueRemoved = function(object, konfigerObject) {
    throw new Error("Abstract method!, simply implements the abstract method - onValueRemoved");
}

module.exports = KonfigerListener;