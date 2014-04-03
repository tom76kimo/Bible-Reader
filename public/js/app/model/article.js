define([
	'backbone'
], function(Backbone){
	return Backbone.Model.extend({
		idAttribute: "_id",
		urlRoot: '/article',
		defaults: {
			title: undefined,
			content: undefined,
			lastUpdate: undefined,
			writeTime: undefined,
			userId: undefined,
			messageId: undefined
		}
	});
});