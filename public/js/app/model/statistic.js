define([
	'underscore',
	'backbone',
	'collection/users'
], function(_, Backbone, Users){
	return Backbone.Model.extend({
		calculate: function(callback){
			//var users = [];
			var users = new Users();
			users.fetch({
				success: function(collection){
					callback && callback(collection);
				}
			});
		}
	});
});