/**
 * Created by 28652 on 2015/11/18.
 */

var common = require('han-common');
var util = common.lib.util;
var proxy = common.proxy;
var Luck = proxy.luck;
var Baby = proxy.baby;
var User = proxy.user;

var service_baby = require('../service/baby');
var _ = require('underscore');
var async = require('async');
var xss = require('xss');
var config = require('../config');

var mod = {};
mod.api = {};
module.exports = mod;

_.extend(mod, {

});


/***************** API *******************/
var api = {};
exports.api = api;

_.extend(mod.api, {
    /**
     * 新增
     * @param req
     * @param res
     */
    add: function(req, res){
        var baby_id = req.query.id, user_id = req.session.user._id, num = req.query.num || 1;

        var o = {
            baby_id: baby_id,
            user_id: user_id
        };

        async.auto({
            user: function(fn){
                User.getById(user_id, fn);
            },
            baby: function(fn){
                Baby.getById(baby_id, fn);
            },
            add:['user', 'baby', function(fn, d){
                o.season = d.baby.season;
                var r = num;
                if(d.user.rmb <= 0) return fn(null, {rmbOut: 1});

                if(d.user.rmb - num <= 0){
                    r = d.user.rmb;
                }else if(d.baby.number_list.length - num <= 0){
                    r = d.baby.number_list.length;
                }

                async.eachSeries(_.range(0, r), function(item, fn1){
                    //顺序执行
                    async.series({
                        baby: function(fn2){
                            var random = _.random(0, d.baby.number_list.length-1);
                            o.number = d.baby.number_list[ random ] + config.numBase;
                            d.baby.number_list.splice(random, 1);
                            d.baby.price_now++;
                            d.baby.price_need--;
                            d.baby.hot++;
                            d.baby.save(fn2);
                        },
                        luck: function(fn2){ Luck.add(o, fn2); },
                        user: function(fn2){ d.user.rmb--;d.user.save(fn2); }
                    }, function(err, d){
                        if(d.baby[0].price_need <= 0) {
                            console.log('luck && start next season');
                            service_baby.luck(d.baby[0]);
                            fn1(err);
                            return;
                        }
                        if(d.user[0].rmb <= 0){
                            console.log('user rmb is 0');
                            fn1(err, {rmbOut: 1});
                            return;
                        }
                        fn1(err);
                    });
                }, fn);

            }]
        }, function(err, d){
            if(d.add && d.add.rmbOut == 1) return res.json( util.res(-100, {msg: 'rmb out'}) );
            res.json(util.res(err));
        });

    }
});