define([
	'jquery',
	'underscore',
	'backbone',
	'collection/achievements',
	'text!tpl/achievement.html'
], function($, _, Backbone, Achievements, tpl){
	return Backbone.View.extend({
		el: $('#main'),
		template: _.template(tpl),
		achievements: new Achievements(),
		initialize: function(options){

		},
		render: function(){
			var self = this;
			this.achievements.fetch({
				success: function(collection){
					self.$el.html(self.template({achievements: JSON.stringify(collection)}));
				}
			});
			
			return this;
		}
	});
});