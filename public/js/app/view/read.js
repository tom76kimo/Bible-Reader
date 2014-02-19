define([
	'jquery',
	'underscore',
	'backbone',
	'view/readPiece',
	'collection/books',
	'text!tpl/read.html'
], function($, _, Backbone, ReadPieceView, Books, tpl){
	return Backbone.View.extend({
		el: $('#main'),
		books: new Books(),
		template: _.template(tpl),
		render: function(){
			var self = this;
			this.books.fetch({
				success: function(books){
					self.$el.html(self.template());
					for(var i=0; i<books.length; ++i){
						var div = $('<div>').appendTo('#readPanel');
						new ReadPieceView({el: div, model: books.models[i]}).render();
					}
				}
			});
			
		}
	});
});