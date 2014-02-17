define([
	'backbone'
], function(Backbone){
	return Backbone.Model.extend({
		defaults: {
			userId: undefined,
			password: undefined,
			name: 'no name',
			data: {}
		}
	});
});