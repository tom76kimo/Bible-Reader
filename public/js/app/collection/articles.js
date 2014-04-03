define([
	'backbone',
	'model/article'
], function(Backbone, Article){
	return Backbone.Collection.extend({
		model: Article,
		url: '/articles'
	});
});