var database = require('./database');
var Achievement = database.Achievement;

new Achievement({icon: 'icon-thumbs-up', name: '好的開始！', condition: '', description: '讀完任意一章。', order: 1}).save();
new Achievement({icon: 'icon-books', name: '書卷獎', condition: '', description: '讀完任意十卷書。', order: 2}).save();
new Achievement({icon: 'icon-spinner3', name: '摩西通', condition: '1,2,3,4,5', description: '讀完創世記、出埃及記、利未記、民數記及申命記。', order: 3}).save();
new Achievement({icon: 'icon-users', name: '大衛王', condition: '9,10', description: '讀完撒母耳記上、下。', order: 4}).save();