define([
	'backbone'
], function(Backbone){
	return Backbone.Model.extend({
		idAttribute: "_id",
		url: '/hasread',
		defaults: {
			userId: undefined,
			bookId: undefined,
			readChapter: undefined
		}
	});
});