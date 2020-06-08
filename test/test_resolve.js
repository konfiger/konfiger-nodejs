
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

it('invalid argument type to Konfiger.resolve', () => {
    var kStream = KonfigerStream.fileStream('test/test.comment.inf')
    kStream.setCommentPrefix("[")
    var kon = Konfiger.fromStream(kStream)
    
    assert.throws(function () { 
        kon.resolve(123)
    }, Error, "io.github.thecarisma.Konfiger", "invalid argument, expecting an object")
})

it('test resolve without matchGetKey function', () => {
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

it('test resolve with changing values and map key with matchPutKey', () => {
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

