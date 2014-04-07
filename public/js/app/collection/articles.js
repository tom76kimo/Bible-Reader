define([
	'backbone',
	'model/article'
], function(Backbone, Article){
	return Backbone.Collection.extend({
		model: Article,
		url: '/articles',
		comparator: function(model){
			return -1 * parseInt(model.get('writeTime'));
		}
	});
});