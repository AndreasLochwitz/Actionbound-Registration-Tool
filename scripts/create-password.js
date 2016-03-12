
var letters = "abcdefghijkmnopqrstuvwxyz",
    digits = "0123456789",
    special = "%$!.*";
    
function getNfromX(n, x) {
    //console.log("n = " + n);
    //console.log("x = " + x);
    var result = "";
    for (var i = 0; i < n; i++) {
        result += x.substr(Math.random() * x.length, 1);
    }
    return result;
}

function myshuffle(text) {
    var textArray = text.split(""),
        changePos = 0,
        temp = "";
    for (var i = 0; i < text.length; i++) {
        changePos = Math.floor(Math.random() * (text.length - i)) + i;
        //console.log("changePos = " + changePos);
        temp = textArray[changePos];
        textArray[changePos] = textArray[i];
        textArray[i] = temp;
    }
    return textArray.join("");
}

function getPassword(lettersN, digitsN, specialsN) {
    var password = getNfromX(lettersN, letters)
        + getNfromX(digitsN, digits)
        + getNfromX(specialsN, special);
    return myshuffle(password);
}

console.log("ABCDEF = " + myshuffle("ABCDEF"));

console.log("5 Letters = " + getNfromX(5, letters));
console.log("3 Digits = " + getNfromX(3, digits));
console.log("2 Specials = " + getNfromX(2, special));

console.log("\n----\nPassword = " + getPassword(4,2,1));
