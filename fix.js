/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2014-06-10 17:10:08
 * @version $Id$
 */
var HasRead = require('./database').HasRead,
    _ = require('underscore');

var number = 1;
HasRead.find({}, function (err, hasReads) {
    if (err) return;
    for (var i=0; i<hasReads.length; ++i) {
        var reOrderString = reOrderReadChapter(hasReads[i].get('readChapter'));
        HasRead.update({_id: hasReads[i].get('_id')}, {readChapter: reOrderString}, function (err, numberAffected, rawResponse) {
            if (err) console.log('error');
            else {
                console.log(number++ + ' is ok effect', numberAffected);
            }
        });
    }
});

function reOrderReadChapter (readChapter) {
    var readChapterArray = readChapter.split(',');
    readChapterArray = _.compact(readChapterArray);
    readChapterArray = _.sortBy(readChapterArray, function(num){ return parseInt(num); });
    readChapterArray = _.uniq(readChapterArray, true);
    return readChapterArray.join(',');
}
