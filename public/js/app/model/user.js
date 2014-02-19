define([
	'backbone'
], function(Backbone){
	return Backbone.Model.extend({
		idAttribute: "_id",
		urlRoot: '/users',
		defaults: {
			username: undefined,
			password: undefined,
			nickname: 'no name',
			data: {}
		}
	});
});