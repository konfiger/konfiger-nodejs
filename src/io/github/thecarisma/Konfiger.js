
/*
 * The MIT License
 *
 * Copyright 2020 Adewale Azeez <azeezadewale98@gmail.com>.
 *
 */
 
const konfigerUtil = require("./KonfigerUtil.js")
const KonfigerObject = require("./KonfigerObject.js")
const KonfigerStream = require("./KonfigerStream.js")
 
const MAX_CAPACITY = Number.MAX_SAFE_INTEGER - 1

function fromFile(filePath, delimeter, seperator) {
    return fromStream((new KonfigerStream('test/test.config.ini', delimeter, seperator)))
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
    this.konfigerObjects = []
    this.delimeter = delimeter
    this.seperator = seperator
    this.errTolerance = false
    this.caseSensitive = true
}

module.exports = { 
    MAX_CAPACITY,
    fromFile
}