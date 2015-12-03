/**
 * Created by 28652 on 2015/11/23.
 */

define(function(require){
    var util = require('../app/util');

    var obj = {};

    _.extend(obj, {
        init: function(o){
            var w = this;

            w.id = o.id;
            w.text = $('#num');

            w.initEvent();
        },

        initEvent: function () {
            var w = this;

            $('.j-as').find('.j-as-btn').click(function(e){
                var dom = $(e.target), v = dom.data('v') * 1;
                w.text.val( w.text.val()*1 + v < 1 ? 1 : w.text.val()*1 + v);
            });

            w.text.click(function(){ this.select(); });

            $('#sub').click(function(){
                w.submit();
            });

            $('.j-tab-item').click(function(){
                w.tabClick( $(this) );
            });

            $('#record').click(function(){

            });
        },

        tabClick: function(dom){
            $('.j-tab-item').removeClass('now');

            dom.addClass('now');
        },

        submit: function(){
            var w = this, num = w.text.val()*1, id = w.id;

            $.ajax({
                url: '/api/luck',
                type: 'post',
                dataType: 'json',
                data: {baby_id: id, num: num},
                success: function(d){
                    util.ajaxCallback(d, function(){
                        window.location.reload();
                    })
                }
            });
        }
    });

    return obj;
});