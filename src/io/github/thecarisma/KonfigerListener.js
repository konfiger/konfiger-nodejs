
/*
 * The MIT License
 *
 * Copyright 2020 Adewale Azeez <azeezadewale98@gmail.com>.
 *
 */

var KonfigerListener = function() {
    if (this.constructor === KonfigerListener) {
      throw new Error("Can't instantiate abstract class!");
    }
};

/**
 @abstract
 */
Animal.prototype.onValueAdded(object, key) = function() {
    throw new Error("Abstract method!, simply implements the abstract method - onValueAdded");
}

/**
 @abstract
 */
Animal.prototype.onChange(object) = function() {
    throw new Error("Abstract method!, simply implements the abstract method - onChange");
}

/**
 @abstract
 */
Animal.prototype.onValueChanged(object, key, oldValue, newValue) = function() {
    throw new Error("Abstract method!, simply implements the abstract method - onValueChanged");
}

/**
 @abstract
 */
Animal.prototype.onValueRemoved(object, konfigerObject) = function() {
    throw new Error("Abstract method!, simply implements the abstract method - onValueRemoved");
}