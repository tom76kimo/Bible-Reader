define([
	'underscore',
	'backbone'
], function(_, Backbone){
	return Backbone.Model.extend({
		idAttribute: "_id",
		urlRoot: '/profile',
		defaults: {
			userId: undefined,
			nickname: undefined,
			email: undefined,
			description: undefined
		}
	});
});