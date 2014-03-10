define([
	'backbone',
	'model/achievement'
], function(Backbone, Achievement){
	return Backbone.Collection.extend({
		model: Achievement,
		url: '/achievements'
	});
});