
const assert = require('assert')
const { KonfigerUtil } = require("../index.js")


it('check escape and unescape seperator', () => {
    var actualStr = '\\,Hello¬W\n-\t-\torld'
    var t1 = KonfigerUtil.escapeString(actualStr, ['¬'])
    var t2 = KonfigerUtil.escapeString(actualStr)
    
    assert.notEqual(actualStr, t1)
    assert.equal(t1, "\\,Hello^¬W\n-\t-\torld")
    assert.notEqual(t1, KonfigerUtil.unEscapeString(t1, ['¬']))
    assert.notEqual(actualStr, KonfigerUtil.unEscapeString(t1))
    assert.equal(KonfigerUtil.unEscapeString(t1, ['¬']), actualStr)
    
    assert.notEqual(t1, t2)
    assert.equal(t2, "\\,Hello¬W\n-\t-\torld")
    assert.notEqual(t2, KonfigerUtil.unEscapeString(t1))
    assert.equal(actualStr, KonfigerUtil.unEscapeString(t2))
    assert.equal(KonfigerUtil.unEscapeString(t1, ['¬']), actualStr)
})