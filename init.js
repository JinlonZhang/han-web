/**
 * Created by 28652 on 2015/9/2.
 */

var common = require('han-common');
var util = common.lib.util;
var Baby = common.proxy.baby;

var _ = require('underscore');
var async = require('async');
var moment = require('moment');

var config = require('./config.json');

var mod = {};
module.exports = mod;

_.extend(mod, {
    init: function(){
        var w = this;

        w.test();
    },

    test: function(){
        /*var random = _.random(0, 4);

        console.log(random);
        process.exit(0);*/

        Baby.getById('VkzK1CQQx', function(err, o){
            var arr = _.range(1, o.price+1);
            o.number_list = arr;
            o.price_need = o.price;
            o.price_now = 0;
            o.save(function(){
                console.log('save OK!');
                process.exit(0);
            });

        })
    }
});

mod.test();