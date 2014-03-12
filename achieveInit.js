var database = require('./database');
var Achievement = database.Achievement;

new Achievement({name: '摩西通', condition: '1,2,3,4,5', description: '讀完創世記、出埃及記、利未記、民數記及申命記。'}).save();
new Achievement({name: '大衛王', condition: '9,10', description: '讀完撒母耳記上、下。'}).save();