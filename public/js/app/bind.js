/**
 * Created by 28652 on 2015/11/18.
 */

define(function(require){
    var util = require('./util');
    var popup = require('../ui/popup');

    var obj = {};

    _.extend(obj, {
        init: function(o){
            var w = this;

            w.sessionId = o.sessionId;
            util.sessionId = o.sessionId;

            w.form = $('.j-form');
            w.luck = $('.j-luck');
            w.pop = $('.j-pop');

            w.initEvent();
        },

        initEvent: function() {
            var w = this;

            w.luck.bind('click', function(){
                w.luckClick( $(this) );
                return false;
            });

            w.pop.each(function(){
                new popup({
                    el: $(this)
                })
            })
        },

        luckClick: function(dom){
            var w = this, url = '/api/luck', id = dom.data('id'), num = dom.data('num'),
                parent = dom.parents('.j-entry'), progress = parent.find('.j-progress');

            util.needLogin(function(){
                $.ajax({
                    type: 'post',
                    url: url,
                    data: {baby_id: id, num: num},
                    dataType: 'json',
                    success: function(d){
                        util.ajaxCallback(d, function(){
                            $.get('/api/baby/' + id, function(d){
                                progress.html( w.tpl_progress({o: d.detail}) );
                            });
                        });
                    }
                })
            })
        },

        tpl_progress: _.template( $('#tpl_baby_progress').html() )

    });

    return obj;
});
