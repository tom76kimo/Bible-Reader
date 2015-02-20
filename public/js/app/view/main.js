define([
    'jquery',
    'underscore',
    'backbone',
    'view/login',
    'view/mainMessage',
    'text!tpl/main.html'
], function($, _, Backbone, LoginView, MainMessageView, tpl){
    var BANNER_CHANGE_TIME = 4000;
    return Backbone.View.extend({
        el: $('#main'),
        template: _.template(tpl),
        initialize: function(){},
        banner: [
            '<p>最要緊的是彼此切實相愛，因為愛能遮掩許多的罪。</p>彼得前書 4:8',
            '<p>愛是恆久忍耐、又有恩慈，愛是不嫉妒，愛是不自誇，不張狂。</p>哥林多前書 13:4',
            '<p>我的心哪，你當默默無聲，專等候神。因為我的盼望是從祂而來。</p>詩篇 62:5'
        ],
        render: function(){
            this.$el.html(this.template({}));
            this.$('#updatesLog').on('show.bs.modal', function (e) {
                $(this).find('#logBody').html('<iframe src="https://docs.google.com/document/d/12oNIfYpWdFBL03toVqxpRJmqICosa1WSnCne5IGUZxs/pub?embedded=true" width="550" height="500"></iframe>');
            });
            setTimeout(this.updateMainBanner.bind(this), 0);
        },
        updateMainBanner: function () {
            var $banner = $('.colorful-blockquote');
            var index = 0;
            var banner = this.banner;
            var bannerFadeout = function (bannerChangeTime) {
                if (!bannerChangeTime) {
                    bannerChangeTime = BANNER_CHANGE_TIME;
                }
                setTimeout(function () {
                    $banner.css({
                        opacity: 0
                    });
                }, bannerChangeTime);
            };
            var transitionendFunc = function () {
                if ($banner.css('opacity') == 1) {
                    bannerFadeout();
                    return;
                }
                index++;
                $banner.html(banner[index%banner.length]);
                $banner.css({
                    opacity: 1
                });
            };
            $banner.on('transitionend', function () {
                transitionendFunc();
            });
            bannerFadeout(2000);
        }
    });
});