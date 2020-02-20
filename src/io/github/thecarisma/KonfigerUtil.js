
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
    for (var c of value) {
        switch (c) {
            case '\t':
                finalValue += "\\t"
                break
            case '\n':
                finalValue += "\\n"
                break
            case '\v':
                finalValue += "\\v"
                break
            case '\r':
                finalValue += "\\r"
                break
            case '\f':
                finalValue += "\\f"
                break
            /*case '\a':
                finalValue += "\\a"
                break*/
            case '\b':
                finalValue += "\\b"
                break
            case '\\':
                finalValue += "\\\\"
                break
            case '\?':
                finalValue += "\\?"
                break
            case '\'':
                finalValue += "\\'"
                break
            /*case '\i':
                finalValue += "\\i"
                break*/
            case '\"':
                finalValue += "\\\""
                break
            case '\000':
                finalValue += "\\000"
                break
            default:
                if (extraEscape) {
                    for (var extra of extraEscape) {
                        if (c === extra) {
                            finalValue += "\\"
                            break
                        }
                    }
                }
                finalValue += c
        }
    }
    return finalValue
}

function unEscapeString(value, extraEscape) {
    var finalValue = ""
    for (var i = 0; i < value.length; ++i) {
        var c = value[i]
        if (c==='\\') {
            if (c===value.length) {
                break
            }
            d = ++i
            switch (value[d]) {
                case 't':
                    finalValue += "\t"
                    break
                case 'n':
                    finalValue += "\n"
                    break
                case 'v':
                    finalValue += "\v"
                    break
                case 'r':
                    finalValue += "\r"
                    break
                case 'f':
                    finalValue += "\f"
                    break
                /*case 'a':
                    finalValue += "\a"
                    break*/
                case 'b':
                    finalValue += "\b"
                    break
                case '\\':
                    finalValue += "\\"
                    break
                case '?':
                    finalValue += "\?"
                    break
                case "'":
                    finalValue += "\'"
                    break
                /*case "i":
                    finalValue += "\i"
                    break*/
                case '\"':
                    finalValue += "\""
                    break
                case '000':
                    finalValue += "\000"
                    break
                default:
                    if (extraEscape) {
                        var continua = false
                        for (var extra of extraEscape) {
                            if (value[d] === extra) {
                                finalValue += extra
                                continua = true
                                break
                            }
                        }
                        if (continua) {
                            continue
                        }
                    }
                    finalValue += value[d]+c
            }
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