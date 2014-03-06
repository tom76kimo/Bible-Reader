define([
	'jquery',
	'underscore',
	'backbone',
	'model/website',
	'model/profile',
	'model/settingProfile',
	'view/mainMessage',
	'view/settingAddr',
	'collection/books',
	'collection/hasReads',
	'collection/groups',
	'text!tpl/setting.html'
], function($, _, Backbone, Website, Profile, SettingProfile, MainMessageView, SettingAddrView, Books, HasReads, Groups, tpl){
	return Backbone.View.extend({
		el: $('#main'),
		template: _.template(tpl),
		render: function(){
			var self = this;
			var user = Website.getUser();
			var sProFinished = $.Deferred();
			var hasReadsFinished = $.Deferred();
			var booksFinished = $.Deferred();
			var groupsFinished = $.Deferred();

			/*
			user.fetch({
				success: function(model){
					userFinished.resolve();
					//self.$el.html(self.template({user: JSON.stringify(model)}));
					var sPro = new SettingProfile({userId: user.id});
					sPro.fetch({
						success: function(){
							console.log(sPro);
						}
					});
				},
				error: function(){
					userFinished.reject();
				}
			}); */

			var sPro = new SettingProfile({userId: user.id});
			sPro.fetch({
				success: function(){
					sProFinished.resolve();
				},
				error: function(){
					sProFinished.reject();
				}
			});

			var hasReads = new HasReads();
			hasReads.fetch({
				success: function(){
					hasReadsFinished.resolve();
				},
				error: function(){
					hasReadsFinished.reject();
				}
			});
			/*
			var books = new Books();
			books.fetch({
				success: function(){
					booksFinished.resolve();
				},
				error: function(){
					booksFinished.reject();
				}
			});
*/
			var books;
			Website.getBooks(function(data){
				if(data){
					books = data;
					booksFinished.resolve();
				}
				else
					booksFinished.reject();
			});

			var groups = new Groups();
			groups.fetch({
				success: function(){
					groupsFinished.resolve();
				},
				error: function(){
					groupsFinished.reject();
				}
			});

			var badges = [];
			$.when(sProFinished, hasReadsFinished, booksFinished, groupsFinished).done(function(){
				var percentage = calculate();
				//console.log(badges);
				/*
				$.post('/getProfile', {userId: user.get('_id')}, function(data){
					self.profile = new Profile({_id: data.id});
					self.profile.fetch({
						success: function(model){
							self.$el.html(self.template({profile: JSON.stringify(model), percentage: percentage, badges: badges}));
							self.addressView = new SettingAddrView({el: self.$('#address'), user: user, profile: model}).render();
						}
					});
				}, 'json');
				*/
				self.$el.html(self.template({profile: JSON.stringify(sPro), percentage: percentage, badges: badges}));
				var group = sPro.get('group');
				for(var i=0; i<groups.length; ++i){
					if(groups.models[i].get('name') === group){
						self.$('#group').append('<option value="'+groups.models[i].get('_id')+'" selected="selected">' + groups.models[i].get('name') + '</option>');
					}
						
					else
						self.$('#group').append('<option value="'+groups.models[i].get('_id')+'">' + groups.models[i].get('name') + '</option>');
				}

				self.addressView = new SettingAddrView({el: self.$('#address'), user: user, profile: sPro, groups: groups}).render();

				/*
				self.profile = new Profile({userId: user.id});
				self.profile.fetch({
					success: function(model){
						self.$el.html(self.template({profile: JSON.stringify(model), percentage: percentage, badges: badges}));
						var group = model.get('group');
						var groupName;
						for(var i=0; i<groups.length; ++i){
							if(groups.models[i].get('_id') === group){
								groupName = groups.models[i].get('name');
								self.$('#group').append('<option value="'+groups.models[i].get('_id')+'" selected="selected">' + groups.models[i].get('name') + '</option>');
							}
								
							else
								self.$('#group').append('<option value="'+groups.models[i].get('_id')+'">' + groups.models[i].get('name') + '</option>');
						}
						model.set({groupName: groupName});
						self.addressView = new SettingAddrView({el: self.$('#address'), user: user, profile: model, groups: groups}).render();
					}
				}); */
			});
			
			return this;
			function calculate(){
				var bibleTotalChapterAmount = 1189;
				var currentChapterAmount = 0;
				for(var i=0; i<hasReads.length; ++i){
					currentChapterAmount += hasReads.models[i].get('amount');
					if(hasReads.models[i].get('amount') === hasReads.models[i].get('totalAmount')){
						var bookId = hasReads.models[i].get('bookId');
						var book = books.findWhere({_id: bookId});
						badges.push(book.get('cname'));
					}
						
				}
				var percentage = Math.floor((currentChapterAmount/bibleTotalChapterAmount)*10000);
				return (percentage/100);
			}
		},
		events: {
			'click #saveBtn': 'saveProfile'
		},
		saveProfile: function(){
			var self = this;
			var nickname = this.$('#nickname').val(),
			    email = this.$('#email').val(),
			    description = this.$('#description').val(),
			    group = this.$('#group').val();

			this.$('#loadingGif').show();
			this.profile.save({nickname: nickname, email: email, description: description, group: group}, {
				success: function(model, response, options){
					self.$('#loadingGif').hide();
					self.$('#myModal').modal('hide');
					self.addressView.render();
					new MainMessageView().success().render('Profile Save Success');
				},
				error: function(model, response, options){
					self.$('#loadingGif').hide();
					self.$('#myModal').modal('hide');
					new MainMessageView().warning().render('Profile Save Failed');
				}
			});
		}
	});
});