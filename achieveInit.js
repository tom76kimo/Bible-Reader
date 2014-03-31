var database = require('./database');
var Achievement = database.Achievement;


new Achievement({icon: 'icon-thumbs-up', name: '好的開始！', condition: '', description: '讀完任意一章。', order: 1}).save();
new Achievement({icon: 'icon-books', name: '書卷獎', condition: '', description: '讀完任意十卷書。', order: 2}).save();
new Achievement({icon: 'icon-spinner3', name: '摩西通', condition: '1,2,3,4,5', description: '讀完創世記、出埃及記、利未記、民數記及申命記。', order: 3}).save();
new Achievement({icon: 'icon-users', name: '大衛王', condition: '9,10', description: '讀完撒母耳記上、下。', order: 4}).save();
new Achievement({icon: 'icon-quill', name: '舊約的旅程', condition: '1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39', description: '讀完舊約。', order: 5}).save();
new Achievement({icon: 'icon-pen', name: '福音戰士', condition: '40,41,42,43', description: '讀完四福音書。', order: 6}).save();
