/**
 * Created by allenxu on 15-12-5.
 */

define(function(require){
    var base = require('./base');

    var obj = function(d){
        base.call(this, d);

        this.init(d);
    };

    _.extend(obj.prototype, {
        init: function(d){
            var w = this;

            w.el = d.el;

            w.item = w.el.find('.j-tab-item');
            w.panel = w.el.find('.j-tab-panel');

            w.item.each(function(i){
                $(this).data('panel', w.panel.eq(i));
            });

            w.panel.hide();

            w.highlight( w.item.eq(0) );

            w.initEvent();
        },

        initEvent: function(){
            var w = this;

            w.item.click(function(e){
                w.highlight( $(this) );
            })
        },

        highlight: function(dom){
            var w = this;

            w.item.removeClass('now');
            dom.addClass('now');

            w.panel.hide();
            dom.data('panel').show();
        }
    });

    return obj;
});