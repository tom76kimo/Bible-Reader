var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/bible');
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
var userSchema = new mongoose.Schema({username: String, password: String, nickname: String, description: String});
var User = mongoose.model('Users', userSchema);

var bookSchema = new mongoose.Schema({name: String, cname: String, shortName: String, amount: Number, order: Number});
var Book = mongoose.model('Books', bookSchema);

var hasReadSchema = new mongoose.Schema({userId: String, bookId: String, readChapter: String, amount: Number, totalAmount: Number});
var HasRead = mongoose.model('hasread', hasReadSchema);

var profileSchema = new mongoose.Schema({userId: String, nickname: String, email: String, description: String, group: String});
var Profile = mongoose.model('profile', profileSchema);

var groupSchema = new mongoose.Schema({name: String, amount: Number, net: String, pastor: String});
var Group = mongoose.model('group', groupSchema);

var achievementSchema = new mongoose.Schema({icon: String, name: String, condition: String, description: String, order: Number});
var Achievement = mongoose.model('achieve', achievementSchema);

exports.User = User;
exports.Book = Book;
exports.HasRead = HasRead;
exports.Profile = Profile;
exports.Group = Group;
exports.Achievement = Achievement;