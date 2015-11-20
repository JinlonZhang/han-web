/**
 * Created by 28652 on 2015/11/20.
 */

var common = require('han-common');
var util = common.lib.util;
var User = common.proxy.user;
var Baby = common.proxy.baby;
var Luck = common.proxy.luck;

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

        res.render('user/luck');
    },

    win: function(req, res){

        res.render('user/win');
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