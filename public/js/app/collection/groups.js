define([
	'backbone',
	'model/group'
], function(Backbone, Group){
	return Backbone.Collection.extend({
		model: Group,
		url: '/groups'
	});
});