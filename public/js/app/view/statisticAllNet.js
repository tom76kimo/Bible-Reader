define([
    'jquery',
    'underscore',
    'backbone',
    'model/website',
    'view/statistic/cardEntry',
    'text!tpl/statisticAllNet.html'
], function ($, _, Backbone, website, CardEntry, tpl) {
    return Backbone.View.extend({
        el: $('#main'),
        template: _.template(tpl),
        render: function() {
            var self = this;

            $.get('/netStatistic', {}, function (data) {
                self.$el.html(self.template);
                data = _.sortBy(data, function (element) {
                    return element.amount * -1;
                });
                for (var i=0; i<data.length; ++i) {
                    var div = $('<div class="card">').appendTo('.statisticMain');
                    new CardEntry({el: div, data: data[i]}).render();
                    (function (target, index) {
                        target.click(function (e) {
                            website.navigate('statistics/' + encodeURIComponent(data[index].name), {trigger: true});
                            //Backbone.history.fragment = '#statistics/' + data[index].name;
                            //window.location.href = '#statistics/' + data[index].name;
                        });
                    }(div, i));
                }
            }, 'json');
            /*
            $.get('/groupStatistic', {}, function(data){
                self.$el.html(self.template);
                data = _.sortBy(data, function (element) {
                    return element.id;
                });
                for (var i=0; i<data.length; ++i) {
                    var div = $('<div class="card">').appendTo('.statisticMain');
                    new CardEntry({el: div, data: data[i]}).render();
                    (function (target, index) {
                        target.click(function (e) {
                            website.navigate('#statistic/' + data[index].id, {trigger: true});
                        });
                    }(div, i));
                }
            }, 'json');
            */
        },
        events: {
            'click #statisticAll': 'statisticAll'
        },
        statisticAll: function () {
            website.navigate('#statistics/all', {trigger: true});
        }
    });
});