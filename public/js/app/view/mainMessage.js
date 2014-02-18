define([
	'jquery',
	'underscore',
	'backbone',
	'text!tpl/mainMessage.html'
], function($, _, Backbone, tpl){
	return Backbone.View.extend({
		el: $('#mainMessage'),
		template: _.template(tpl),
		style: 'success',
		initialize: function(){
			this.$el.html(this.template({message: 'Well done!'}));
		},
		render: function(message){
			var self = this;
			if(this.$el.css('display') === 'block'){
				this.$el.hide('400', function() {
					exec();
				});
			}
			else
				exec();
			
			function exec(){
				if(message)
					self.$el.html(self.template({message: message}));
				self.changeStyle();
				self.$el.slideDown(400);
			}
		},
		warning: function(){
			this.style = 'warning';
			return this;
		},
		success: function(){
			this.style = 'success';
			return this;
		},
		info: function(){
			this.style = 'info';
			return this;
		},
		danger: function(){
			this.style = 'danger';
			return this;
		},
		changeStyle: function(){
			var $alert = this.$('.alert');
			$alert.removeClass();
			$alert.addClass('alert alert-' + this.style + ' alert-dismissable');
		}
	});
});