define([
	'backbone',
	'model/book'
], function(Backbone, Book){
	return Backbone.Collection.extend({
		model: Book,
		url: '/books'
	});
});