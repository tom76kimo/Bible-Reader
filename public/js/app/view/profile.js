define([
	'jquery',
	'underscore',
	'backbone',
	'model/profile',
	'model/website',
	'collection/groups',
	'text!tpl/profile.html'
], function($, _, Backbone, Profile, Website, Groups, tpl){
	return Backbone.View.extend({
		template: _.template(tpl),
		el: $('#main'),
		initialize: function(options){
			this.userId = options.userId;
		},
		render: function(){
			var self = this,
			    profile = new Profile({userId: this.userId});
			var profileFetchSuccess = function (model) {
				Website.getUserById(self.userId, function(user){
					new Groups().fetch({
						success: function(groups){
							var group = groups.findWhere({_id: profile.get('group')});
							var groupName = '無';
							if(group)
								groupName = group.get('name');
							self.$el.html(self.template({user: JSON.stringify(user), profile: JSON.stringify(profile), groupName: groupName}));

							self.addAchievements();

							if(profile.get('FBID') !== '' && profile.get('FBID') !== undefined){
								self.$('#thumbnailPhoto').attr('src', 'http://graph.facebook.com/' + profile.get('FBID') + '/picture?width=140&height=140');
							}
							else
								self.$('#thumbnailPhoto').attr('src', 'assets/images/man.png');
							self.$('#thumbnailPhoto').on('load', function(){
								$(this).addClass('animate fadeInDown');
							});
							self.$('#thumbnailPhoto').on('error', function(){
								$(this).attr('src', 'assets/images/man.png');
							});
						}
					});
				});
			};

			profile.fetch({
				success: profileFetchSuccess,
				error: function(){
					
				}
			});
			
			return this;
		},

		addAchievements: function () {
			var self = this;
			$.get('/userAchievements/' + this.userId, {}, function (data) {
				for (var i=0; i<data.length; ++i) {
					self.$('#achievementsList').append('<span class="badge" style="background-color: #FC53A8; margin: 5px;">'+data[i]+'</span>');
				}
			}, 'json');
		}
	});
});