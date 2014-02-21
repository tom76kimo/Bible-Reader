define([
	'backbone',
	'model/user'
], function(Backbone, User){
	return Backbone.Collection.extend({
		model: User,
		url: '/allUser'
	});
});