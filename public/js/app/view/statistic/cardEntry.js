define([
    'jquery',
    'underscore',
    'backbone',
    'text!tpl/statistic/cardEntry.html'
], function ($, _, Backbone, tpl) {
    return Backbone.View.extend({
        el: $('#main'),
        template: _.template(tpl),
        initialize: function(options) {
            this.data = options.data;
        },
        render: function() {
            this.$el.html(this.template({data: this.data}));
        }
    });
});