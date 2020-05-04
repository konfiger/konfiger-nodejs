
/*
 * The MIT License
 *
 * Copyright 2020 Adewale Azeez <azeezadewale98@gmail.com>.
 *
 */
 
function typeOf(arg) {
	if (isChar(arg)) {
		return 'char'
	}
	else if (isObject(arg)) {
		return 'object'
	}
	return typeof arg 
}

function isDefined(arg) {
	return typeof arg !== "undefined"
}

function isString(arg) {
	return typeof arg === "string"
}

function isNumber(arg) {
	return typeof arg === "number"
}

function isObject(arg) {
	return typeof arg === "object"
}

function isChar(arg) {
	return typeof arg === "string" && arg.length === 1
}

function isBoolean(arg) {
	return typeof arg === "boolean"
}

function isFloat(arg) {
    return Number(arg) === arg && arg % 1 !== 0
}

function throwError(title, error) {
    throw new Error(title + ": " + error)
}

function escapeString(value, extraEscape) {
    var finalValue = ""
    for (var i = 0; i < value.length; i++) {
        let c = value[i]
		if (extraEscape) {
			for (var extra of extraEscape) {
				if (c === extra) {
					finalValue += "/"
					break
				}
			}
		}
		finalValue += c
    }
    return finalValue
}

function unEscapeString(value, extraEscape) {
    var finalValue = ""
    for (var i = 0; i < value.length; ++i) {
        var c = value[i]
        if (c==='/') {
            if (i===value.length) {
                break
            }
            var d = ++i
            if (extraEscape) {
				var continua = false
				for (var extra of extraEscape) {
					if (value[d] === extra) {
						finalValue += value[d]
						continua = true
						break
					}
				}
				if (continua) {
					continue
				}
			}
			finalValue += "/" + value[d]
            continue
        }
        finalValue += c
    }
    return finalValue
}

module.exports = { 
	typeOf,
	isDefined,
	isString,
	isNumber,
	isObject,
	isChar,
	isBoolean,
    throwError,
    unEscapeString,
    escapeString,
    isFloat
}