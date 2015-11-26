/**
 * Created by 28652 on 2015/11/25.
 */

define(function(require){

    var obj = function(o){
        var w = this;

        w.el = o && o.el;

        var opt = w.constructor.opt, sup = w.constructor.__super__;
        while(sup){
            opt = $.extend({}, sup.constructor.opt, opt);
            sup = sup.constructor.__super__;
        }

        w.opt = $.extend(
            true,
            {},
            opt || {},
            data.opt || {},
            JSON.parse( (w.el && w.el.attr("opt")) || "{}"),
            w.el && w.el.data("opt") || {}
        );
    };

    return obj;
});