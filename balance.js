var database = require('./database'),
	User = database.User,
	Book = database.Book,
	HasRead = database.HasRead,
	Profile = database.Profile,
	Group = database.Group,
	Achievement = database.Achievement,
	Article = database.Article;



HasRead.find({}, function (err, hasRead) {
	for (var i=0; i<hasRead.length; ++i) {
		(function(index){
			Book.findById(hasRead[index].bookId, function(err, book){
				if (book === undefined) {
					HasRead.remove({_id: hasRead[index]._id}, function () {
						console.log('removed');
					});
				} else {
				}
			});
		}(i));
	}
});