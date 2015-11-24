/**
 * Created by 28652 on 2015/11/18.
 */

var common = require('han-common');
var util = common.lib.util;
var User = common.proxy.user;
var Baby = common.proxy.baby;
var Luck = common.proxy.luck;
var LuckGroup = common.proxy.luck_group;
var Rmb = common.proxy.rmb;
var Baby = common.proxy.baby;

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
        var id = req.params.id;

        Baby.getById(id, function(err, d){
            res.render('baby', {detail: d});
        });

    }
});

/****************** API *********************/
_.extend(mod.api, {
    detail: function(req, res){
        var id = req.params.id;

        Baby.getById(id, {name: 1, cover: 1, price: 1, price_now: 1}, function(err, d){
            res.json( util.res(err, {detail: d}) );
        });
    }
});