var fs = require('fs');
var readline = require('readline');
var stream = require('stream');

var readBible = function (bookName, chapter, options) {
    if (!typeof bookName === 'String' || !typeof chapter === 'Number') {
        return;
    }
    var instream = fs.createReadStream('hb5.txt', {encoding: 'utf8'});
    var outstream = new stream;
    var rl = readline.createInterface(instream, outstream);

    var rexString;
    var resultArray = [];
    var isPass = false;

    if (options && options.section) {
        rexString = new RegExp(bookName + '\\s' + chapter + ':' + options.section);
    } else {
        rexString = new RegExp(bookName + '\\s' + chapter + ':');
    }
    rl.on('line', function(line){
        isPass = rexString.test(line.toString());
        if (isPass) {
            resultArray.push(line.toString());
            isPass = false;
        }
    });

    rl.on('close', function(){
        options && options.callback && options.callback(resultArray);
    });
};

// readBible('1Ch', 2, {
//     callback: function (result) {
//         console.log('result: ', result);
//     }
// });

module.exports = readBible;