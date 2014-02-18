var fs = require('fs'),
    readline = require('readline'),
    stream = require('stream');

var instream = fs.createReadStream('hb5.txt', {encoding: 'utf8'});
var outstream = new stream;
var rl = readline.createInterface(instream, outstream);

var lineCount = 0;
var bLine = 0;
rl.on('line', function(line){
	lineCount ++;
	bLine ++;
	if(lineCount > 20)
		return;
	var o = line.toString().match(/[0-9]:[0-9]/);
	console.log(o);
});

rl.on('close', function(){
	console.log('finished: ' + bLine);
});