define([
	'jquery',
	'underscore',
	'backbone',
	'view/readPiece',
	'model/hasRead',
	'model/website',
	'collection/books',
	'collection/hasReads',
	'text!tpl/read.html'
], function($, _, Backbone, ReadPieceView, HasRead, Website, Books, HasReads, tpl){
	return Backbone.View.extend({
		el: $('#main'),
		books: new Books(),
		hasReads: new HasReads(),
		template: _.template(tpl),
		render: function(){
			var self = this;
			var bookFinished = $.Deferred(),
			    hasReadFinished = $.Deferred();
			this.books.fetch({
				success: function(books){
					bookFinished.resolve();
				}
			});

			this.hasReads.fetch({
				success: function(){
					hasReadFinished.resolve();
				}
			});

			$.when(bookFinished, hasReadFinished).done(function(){
				self.$el.html(self.template());
				for(var i=0; i<self.books.length; ++i){
					var div = $('<div>').appendTo('#readPanel');
					var book = self.books.models[i];
					var hasRead = self.hasReads.findWhere({bookId: book.get('_id')});
					if(hasRead){
						//new ReadPieceView({el: div, model: book, hasRead: hasRead}).render();
					}
					else{
						var userId = Website.getUser().get('_id');
						hasRead = new HasRead({userId: userId, bookId: book.get('_id'), readChapter: '', amount: 0, totalAmount: book.get('amount')});
						
					}
					new ReadPieceView({el: div, model: book, hasRead: hasRead}).render();
					//self.hasReads.add(hasRead);
				}
			});
			
		}
	});
});