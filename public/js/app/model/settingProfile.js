define([
	'underscore',
	'backbone'
], function(_, Backbone){
	return Backbone.Model.extend({
		idAttribute: "userId",
		urlRoot: '/settingProfile',
		defaults: {
			userId: undefined,
			username: undefined,
			nickname: undefined,
			email: undefined,
			description: undefined,
			group: undefined
		}
	});
});