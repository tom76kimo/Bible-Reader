define([
	'backbone'
], function(Backbone){
	return Backbone.Model.extend({
		idAttribute: "_id",
		defaults: {
			name: undefined,
			cname: undefined,
			shortName: undefined,
			amount: undefined
		}
	});
});