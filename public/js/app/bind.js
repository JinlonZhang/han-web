/**
 * Created by 28652 on 2015/11/18.
 */

define(function(require){
    var util = require('./util');

    var obj = {};

    _.extend(obj, {
        init: function(o){
            var w = this;

            w.sessionId = o.sessionId;
            util.sessionId = o.sessionId;

            w.form = $('.j-form');
            w.luck = $('.j-luck');

            w.initEvent();
        },

        initEvent: function() {
            var w = this;

            w.luck.bind('click', function(){
                w.luckClick( $(this) );
                return false;
            });
        },

        needLogin: function(fn){
            var w = this;

            if(w.sessionId == ''){
                alert('need login');
            }else{
                fn();
            }

        },

        luckClick: function(dom){
            var w = this, url = dom.data('url'), id = dom.data('id');

            util.needLogin(function(){
                $.ajax({
                    type: 'post',
                    url: url,
                    data: {baby_id: id, num: 1},
                    dataType: 'json',
                    success: function(d){
                        if(d.code == -100){
                            alert('need rmb');
                            return;
                        }
                        window.location.reload();
                    }
                })
            })
        }
    });

    return obj;
});