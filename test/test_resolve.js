
const assert = require('assert')
const { Konfiger, KonfigerStream } = require("../index.js")

var textsFlat = {
    project: "",
    author: "",
    Platform: "",
    File: ""
}

var texts = {
    project: "",
    author: "",
    Platform: "",
    file: "",
    matchGetKey: function(key) {
        switch (key) {
            case "project":
                return "Project"
            case "author":
                return "Author"
            case "file":
                return "File"
        }
    },
    matchPutKey: function(key) {
        switch (key) {
            case "Project":
                return "project"
            case "Author":
                return "author"
            case "File":
                return "file"
        }
    }
}

var entries = {
    project: "konfiger",
    author: "Adewale Azeez",
    platform: "Cross Platform",
    file: "test.comment.inf"
}

var mixedTypes = {
    project: "",
    weAllCake: false,
    annotatedEntry: false,
    ageOfEarth: 0,
    lengthOfRiverNile: 0,
    pi: 0.0,
    pie: 0.0,
    matchGetKey: function(key) {
        switch (key) {
            case "annotatedEntry":
                return "AnnotatedEntry"
        }
    },
    matchPutKey: function(key) {
        switch (key) {
            case "AnnotatedEntry":
                return "annotatedEntry"
        }
    }
}

var mixedTypesEntries = {
    project: "konfiger",
    weAllCake: true,
    ageOfEarth: 121526156252322,
    lengthOfRiverNile: 45454545,
    pi: 3.14,
    pie: 1.1121
}

it('invalid argument type to Konfiger.resolve', () => {
    var kStream = KonfigerStream.fileStream('test/test.comment.inf')
    kStream.setCommentPrefix("[")
    var kon = Konfiger.fromStream(kStream)
    
    assert.throws(function () { 
        kon.resolve(123)
    }, Error, "io.github.thecarisma.Konfiger", "invalid argument, expecting an object")
})

it('resolve without matchGetKey function', () => {
    var kStream = KonfigerStream.fileStream('test/test.comment.inf')
    kStream.setCommentPrefix("[")
    var kon = Konfiger.fromStream(kStream)
    kon.resolve(textsFlat)
    
    assert.equal(textsFlat.project, "")
    assert.equal(textsFlat.Platform, "Cross Platform")
    assert.equal(textsFlat.File, "test.comment.inf")
    assert.equal(textsFlat.author, "")
})

it('test resolve with matchGetKey function', () => {
    var kStream = KonfigerStream.fileStream('test/test.comment.inf')
    kStream.setCommentPrefix("[")
    var kon = Konfiger.fromStream(kStream)
    kon.resolve(texts)
    
    assert.equal(texts.project, "konfiger")
    assert.equal(texts.Platform, "Cross Platform")
    assert.equal(texts.file, "test.comment.inf")
    assert.equal(texts.author, "Adewale Azeez")
})

it('resolve with changing values and map key with matchPutKey', () => {
    var kStream = KonfigerStream.fileStream('test/test.comment.inf')
    kStream.setCommentPrefix("[")
    var kon = Konfiger.fromStream(kStream)
    kon.resolve(texts)
    
    assert.equal(texts.project, "konfiger")
    assert.equal(texts.Platform, "Cross Platform")
    assert.equal(texts.file, "test.comment.inf")
    assert.equal(texts.author, "Adewale Azeez")
    
    kon.put("Project", "konfiger-nodejs")
    kon.put("Platform", "Windows, Linux, Mac, Raspberry")
    kon.put("author", "Thecarisma")
    
    assert.equal(texts.project, "konfiger-nodejs")
    assert.equal(texts.Platform.indexOf("Windows") > -1, true)
    assert.equal(texts.Platform.indexOf("Linux") > -1, true)
    assert.equal(texts.Platform.indexOf("Mac") > -1, true)
    assert.equal(texts.Platform.indexOf("Raspberry") > -1, true)
    assert.equal(texts.author, "Thecarisma")
    
    kon.put("author", "Adewale")
    assert.equal(texts.author, "Adewale")
})

it('dissolve an object into konfiger', () => {
    var kon = Konfiger.fromString("")
    kon.dissolve(entries)
    
    assert.equal(kon.get("project"), "konfiger")
    assert.equal(kon.get("platform"), "Cross Platform")
    assert.equal(kon.get("file"), "test.comment.inf")
    assert.equal(kon.get("author"), "Adewale Azeez")
})

it('detach an object from konfiger', () => {
    var kStream = KonfigerStream.fileStream('test/test.comment.inf')
    kStream.setCommentPrefix("[")
    var kon = Konfiger.fromStream(kStream)
    kon.resolve(texts)
    
    assert.equal(texts.project, "konfiger")
    assert.equal(texts.Platform, "Cross Platform")
    assert.equal(texts.file, "test.comment.inf")
    assert.equal(texts.author, "Adewale Azeez")
	assert.equal(texts, kon.detach())
    
    kon.put("Project", "konfiger-nodejs")
    kon.put("Platform", "Windows, Linux, Mac, Raspberry")
    kon.put("author", "Thecarisma")
    
    assert.notEqual(texts.project, "konfiger-nodejs")
    assert.notEqual(texts.Platform.indexOf("Windows") > -1, true)
    assert.notEqual(texts.Platform.indexOf("Linux") > -1, true)
    assert.notEqual(texts.Platform.indexOf("Mac") > -1, true)
    assert.notEqual(texts.Platform.indexOf("Raspberry") > -1, true)
    assert.notEqual(texts.author, "Thecarisma")
    
    kon.put("author", "Adewale")
    assert.notEqual(texts.author, "Adewale")
})

it('resolve with matchGetKey function mixedTypes', () => {
    var kon = Konfiger.fromFile('test/mixed.types')
    kon.resolve(mixedTypes)
    
    assert.strictEqual(mixedTypes.project, "konfiger")
    assert.notStrictEqual(mixedTypes.weAllCake, "true")
    assert.strictEqual(mixedTypes.weAllCake, true)
    assert.strictEqual(mixedTypes.annotatedEntry, true)
    assert.notStrictEqual(mixedTypes.ageOfEarth, "121526156252322")
    assert.strictEqual(mixedTypes.ageOfEarth, 121526156252322)
    assert.notStrictEqual(mixedTypes.lengthOfRiverNile, "45454545")
    assert.strictEqual(mixedTypes.lengthOfRiverNile, 45454545)
    assert.notStrictEqual(mixedTypes.pi, "3.14")
    assert.strictEqual(mixedTypes.pi, 3.14)
    assert.notStrictEqual(mixedTypes.pie, "1.1121")
    assert.strictEqual(mixedTypes.pie, 1.1121)
})

it('dissolve an mixedTypes object into konfiger', () => {
    var kon = Konfiger.fromFile('test/mixed.types')
    kon.dissolve(mixedTypesEntries)
    
    assert.strictEqual(kon.get("project"), "konfiger")
    assert.equal(kon.getString("weAllCake"), "true")
    assert.strictEqual(kon.getBoolean("weAllCake"), true)
    assert.equal(kon.get("ageOfEarth"), "121526156252322")
    assert.strictEqual(kon.getLong("ageOfEarth"), 121526156252322)
    assert.equal(kon.get("lengthOfRiverNile"), "45454545")
    assert.strictEqual(kon.getInt("lengthOfRiverNile"), 45454545)
    assert.equal(kon.get("pi"), "3.14")
    assert.strictEqual(kon.getFloat("pi"), 3.14, 1)
    assert.equal(kon.get("pie"), "1.1121")
    assert.strictEqual(kon.getDouble("pie"), 1.1121, 1)
})

it('resolve with changing values for mixedTypes', () => {
    var kon = Konfiger.fromFile('test/mixed.types')
    kon.resolve(mixedTypes)
    
    assert.strictEqual(mixedTypes.project, "konfiger")
    assert.strictEqual(mixedTypes.weAllCake, true)
    assert.strictEqual(mixedTypes.ageOfEarth, 121526156252322)
    assert.strictEqual(mixedTypes.lengthOfRiverNile, 45454545)
    assert.strictEqual(mixedTypes.pi, 3.14, 1)
    assert.strictEqual(mixedTypes.pie, 1.1121, 1)
    assert.strictEqual(mixedTypes.annotatedEntry, true)

    kon.put("project", "konfiger-nodejs")
    kon.put("AnnotatedEntry", false)
    kon.put("ageOfEarth", 121323)
    kon.put("pie", 2.1212)

    assert.strictEqual(mixedTypes.project, "konfiger-nodejs")
    assert.strictEqual(mixedTypes.annotatedEntry, false)
    assert.strictEqual(mixedTypes.ageOfEarth, 121323)
    assert.strictEqual(mixedTypes.pie, 2.1212, 1)

    kon.put("AnnotatedEntry", true)
    assert.strictEqual(mixedTypes.annotatedEntry, true)
})

it('resolve with changing values and map key with attach', () => {
    var kStream = KonfigerStream.fileStream('test/test.comment.inf')
    kStream.setCommentPrefix("[")
    var kon = Konfiger.fromStream(kStream)
    texts.project = ""
    texts.Platform = ""
    texts.file = ""
    texts.author = ""
    kon.attach(texts)
    
    assert.notEqual(texts.project, "konfiger")
    assert.notEqual(texts.Platform, "Cross Platform")
    assert.notEqual(texts.file, "test.comment.inf")
    assert.notEqual(texts.author, "Adewale Azeez")
    
    kon.put("Project", "konfiger-nodejs")
    kon.put("Platform", "Windows, Linux, Mac, Raspberry")
    kon.put("author", "Thecarisma")
    
    assert.equal(texts.project, "konfiger-nodejs")
    assert.equal(texts.Platform.indexOf("Windows") > -1, true)
    assert.equal(texts.Platform.indexOf("Linux") > -1, true)
    assert.equal(texts.Platform.indexOf("Mac") > -1, true)
    assert.equal(texts.Platform.indexOf("Raspberry") > -1, true)
    assert.equal(texts.author, "Thecarisma")
    
    kon.put("author", "Adewale")
    assert.equal(texts.author, "Adewale")
})
