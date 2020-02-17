const KonfigerListener = require("../src/io/github/thecarisma/KonfigerListener.js");


try {
    var konfigerListener = new KonfigerListener()
} catch (err) {
    console.log(err.message)
}

var Listener = function() {
    console.log("booyah inititialize it, abstract working")
};
Listener.prototype = Object.create(KonfigerListener.prototype)
Listener.prototype.onValueAdded = function(object, key) {
    console.log("onValueAdded: " + key)
}

var lisner = new Listener()
lisner.onValueAdded(null, "Key")
