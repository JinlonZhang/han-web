/**
 * Created by 28652 on 2015/11/18.
 */

define(function(require){

    var obj = {};

    _.extend(obj, {

        ajaxCallback: function(){

        },

        needLogin: function(fn){
            var w = this;

            if(w.sessionId == ''){
                alert('need login');
            }else{
                fn();
            }

        }
    });

    return obj;
});