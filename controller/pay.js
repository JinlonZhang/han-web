/**
 * Created by 28652 on 2015/11/19.
 */

var common = require('han-common');
var util = common.lib.util;
var proxy = common.proxy;
var User = proxy.user;
var Rmb = proxy.rmb;

var _ = require('underscore');
var async = require('async');
var xss = require('xss');
var config = require('../config');

var mod = {};
mod.api = {};
module.exports = mod;

_.extend(mod, {
    index: function(req, res){
        res.render('pay');
    }
});


/***************** API *******************/
var api = {};
exports.api = api;

_.extend(mod.api, {

    add: function(req, res) {
        var num = req.body.num * 1, user = req.session.user;

        if(_.isNaN(num) || num == 0) return res.json( util.res(-1, {msg: '请输入合法的金额。'}) );

        async.auto({
            user: function(fn){
                User.getById(user._id, fn);
            },
            rmb: function(fn){
                Rmb.add({user_id: user._id, num: num}, fn);
            },
            pay:['user', function(fn, d){
                d.user.rmb = d.user.rmb + num;
                req.session.user = d.user;
                d.user.save(fn);
            }]
        }, function(err, d){

            res.json( util.res(err) );
        });

    }
});