define([
	'jquery',
	'underscore',
	'backbone',
	'text!tpl/readPiece.html'
], function($, _, Backbone, tpl){
	return Backbone.View.extend({
		template: _.template(tpl),
		render: function(){
			var self = this;
			this.$el.html(this.template({book: JSON.stringify(this.model)}));
			this.$('.panel').on('show.bs.collapse', function(){
				self.$('span').removeClass('glyphicon-chevron-right');
				self.$('span').addClass('glyphicon-chevron-down');
			});

			this.$('.panel').on('hide.bs.collapse', function(){
				self.$('span').removeClass('glyphicon-chevron-down');
				self.$('span').addClass('glyphicon-chevron-right');
			});
		}
	});
});