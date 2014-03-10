define(['backbone'], function(Backbone){
	return Backbone.Model.extend({
		idAttribute: "_id",
		defaults: {
			'name': undefined,
			'condition': undefined,
			'description': undefined
		}
	});
});