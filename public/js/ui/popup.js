/**
 * Created by allenxu on 15-11-25.
 */

define(function(require){
    var base = require('./base');

    var obj = function(d){
        base.call(this, d);

        this.init(d);
    };

    _.extend(obj.prototype, {
        init: function(d){

        }
    });

    return obj;
});