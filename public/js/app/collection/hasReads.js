define([
	'backbone',
	'model/hasRead'
], function(Backbone, hasRead){
	return Backbone.Collection.extend({
		model: hasRead,
		url: '/hasreads'
	});
});