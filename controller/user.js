/**
 * Created by 28652 on 2015/11/20.
 */

var common = require('han-common');
var util = common.lib.util;
var User = common.proxy.user;
var Baby = common.proxy.baby;
var Luck = common.proxy.luck;
var LuckGroup = common.proxy.luck_group;
var Rmb = common.proxy.rmb;

var config = require('../config.json');
var async = require('async');
var xss = require('xss');
var _ = require('underscore');
var fs = require('fs');
var moment = require('moment');

var USER = null;

var mod = {};
mod.api = {};
module.exports = mod;

_.extend(mod, {
    index: function(req, res){
        res.render('user');
    },

    luck: function(req, res){
        var query = {user_id: USER._id}, skip = req.query.skip || 0, limit = 20;
        //res.render('user/luck', {list: [], total: 0});
        //return;
        async.auto({
            list: function(fn){
                LuckGroup.getByQuery(query, {}, {skip: skip, limit: limit}, fn);
            },
            babyDetail: ['list', function(fn, d){
                async.each(d.list, function(item ,fn2){
                    Baby.getById(item.baby_id, {name: 1, season: 1, price: 1, cover: 1}, function(err2, baby){
                        item.baby = baby;
                        fn2(err2);
                    })
                }, fn);
            }],
            total: function(fn){
                LuckGroup.getTotalByQuery(query, fn);
            }
        }, function(err, d){
            res.render('user/luck', {list: d.list, total: d.total});
        });

    },

    win: function(req, res){
        var query = {user_id: USER._id, type: 1}, skip = req.query.skip || 0, limit = 20;

        async.auto({
            list: function(fn){
                Luck.getByQuery(query, {}, {skip: skip, limit: limit}, fn);
            },
            babyDetail: ['list', function(fn, d){
                async.each(d.list, function(item ,fn2){
                    Baby.getById(item.baby_id, {name: 1, season: 1, price: 1, cover: 1}, function(err2, baby){
                        item.baby = baby;
                        fn2(err2);
                    })
                }, fn);
            }],
            total: function(fn){
                Luck.getTotalByQuery(query, fn);
            }
        }, function(err, d){
            res.render('user/luck_win', {list: d.list, total: d.total});
        });
    },

    recharge: function(req, res){
        var query = {user_id: USER._id}, skip = req.query.skip, limit = 20;

        Rmb.getByQuery(query, {}, {skip: skip, limit: limit}, function(err, list){
            res.render('user/recharge', {list: list, total: 0})
        })

    },

    baseInfo: function(req, res, next){
        var id = req.params.id, isSelf = false, us = {};

        if(req.session.user){
            isSelf = id == req.session.user._id;
        }

        res.locals.isSelf = isSelf;

        async.auto({
            user: function(fn){
                User.getById(id, fn);
            }
        }, function(err, d){
            USER = d.user;
            res.locals.user = d.user;

            next();
        })
    }
});

/****************** API *********************/
_.extend(mod.api, {

});