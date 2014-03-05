define([
	'underscore',
	'backbone'
], function(_, Backbone){
	return Backbone.Model.extend({
		idAttribute: "_id",
		urlRoot: '/group',
		defaults: {
			name: undefined,
			amount: undefined,
			net: undefined,
			pastor: undefined
		}
	});
});