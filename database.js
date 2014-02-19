var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/bible');
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
var userSchema = new mongoose.Schema({username: 'string', password: 'string'});
var User = mongoose.model('Users', userSchema);

exports.User = User;