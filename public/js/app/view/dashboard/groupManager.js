define([
	'jquery',
	'underscore',
	'backbone',
	'alertify.min',
	'model/group',
	'view/mainMessage',
	'text!tpl/dashboard/groupManager.html'
], function($, _, Backbone, alertify, Group, MainMessageView, tpl){
	return Backbone.View.extend({
		template: _.template(tpl),
		render: function(){
			this.$el.html(this.template());
			return this;
		},
		events: {
			'click #addGroup': 'addGroup'
		},
		addGroup: function(){
			var name = this.$('#groupName').val(),
			    net = this.$('#groupNet').val(),
			    pastor = this.$('#groupPastor').val();
			//console.log(name+net+pastor);
			var group = new Group();
			group.save({name: name, amount: 0, net: net, pastor: pastor}, {
				success: function(model){
					//new MainMessageView().success().render('Insert successfully');
					alertify.success('輸入成功');
				},
				error: function(){
					//new MainMessageView().danger().render('Insert failed');
					alertify.error('輸入失敗');
				}
			});
		}
	});
});