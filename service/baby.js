/**
 * Created by 28652 on 2015/11/19.
 */

var common = require('han-common');
var util = common.lib.util;
var Baby = common.proxy.baby;
var Luck = common.proxy.luck;

var _ = require('underscore');
var async = require('async');
var moment = require('moment');
var config = require('../config');

var mod = {};
module.exports = mod;

_.extend(mod, {
    restart: function(o){

        var arr = _.range(1, o.price+1);
        o.number_list = arr;
        o.price_need = o.price;
        o.price_now = 0;
        o.season++;

        o.save();
    },

    luck: function(o, fn){
        var w = this, baby = o.baby, luck = o.luck;

        async.auto({
            luckNum: function(fn){
                Luck.getByQuery({date: {$lt: luck.date} }, {}, {sort: {date: -1}, limit: 50}, function(err, list){
                    var num = 0;
                    _.each(list, function(entry){
                        console.log(entry.baby_id);
                        var tmp = moment(entry.date).format('HHmmssSSS') * 1;
                        num = num + tmp;
                    });

                    fn(err, num % baby.price);
                })
            },
            modify: ['luckNum', function(fn, d){
                d.luckNum = d.luckNum + config.numBase + 1;
                Luck.getByQuery({baby_id: baby._id, season: baby.season, number: d.luckNum}, {}, {}, function(err, list){
                    if(list.length > 0){
                        list[0].type = 1;
                        list[0].save(fn);
                    }
                });
            }]
        }, function(err, d){
            console.log('luck done');
            w.restart(o);
            fn && fn(err);
        });


    }
});