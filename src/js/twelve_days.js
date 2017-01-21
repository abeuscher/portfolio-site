var sing = function(data) {
    var lines = [];
    var words = {
        "intro" : function(num) {
            return "On the " + num + " day of Christmas my true love gave to me "
        },
        "numbers": ["first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth", "eleventh", "twelfth"]
    }
    var days = data.split("\n").filter(function(n) {
        return n != ""
    });
    for (day in days) {
        lines[day] = words.intro(words.numbers[day]);
        if (day > 0) {
            for (countdown = day; countdown > 0; countdown--) {
                lines[day] += parseInt(countdown) + 1 + " " + days[countdown] + " ";
            }
            lines[day] += "and ";
        }
        lines[day] += "a " + days[0];
    }
    console.log(lines);
};
var days = readTextFile("days.txt", sing);

function readTextFile(file, cb) {
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4) {
            if (rawFile.status === 200 || rawFile.status == 0) {
                cb(rawFile.responseText);
            }
        }
    }
    rawFile.send(null);
}
