/**
 * Created by 28652 on 2015/11/23.
 */

define(function(require){
    var obj = {};

    _.extend(obj, {
        init: function(){
            var w = this;


            w.text = $('#num');

            w.initEvent();
        },

        initEvent: function () {
            var w = this;

            $('.j-as').find('.j-as-btn').click(function(e){
                var dom = $(e.target), v = dom.data('v') * 1;
                w.text.val( w.text.val()*1 + v < 1 ? 1 : w.text.val()*1 + v);
            });

            w.text.click(function(){ this.select(); })

            $('#sub').click(function(){
                w.submit();
            })
        },

        submit: function(){
            var w = this;

            alert(w.text.val() * 1);
        }
    });

    return obj;
});