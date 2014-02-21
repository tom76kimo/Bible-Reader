var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/bible');
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
var userSchema = new mongoose.Schema({username: 'string', password: 'string'});
var User = mongoose.model('Users', userSchema);

var bookSchema = new mongoose.Schema({name: String, cname: String, shortName: String, amount: Number, order: Number});
var Book = mongoose.model('Books', bookSchema);

var hasReadSchema = new mongoose.Schema({userId: String, bookId: String, readChapter: String, amount: Number, totalAmount: Number});
var HasRead = mongoose.model('hasread', hasReadSchema);

exports.User = User;
exports.Book = Book;
exports.HasRead = HasRead;