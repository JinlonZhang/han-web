/**
 * User: 28652
 * Date: 15-7-1
 * Time: 上午8:55
 */
var common = require('han-common');
var util = common.lib.util;
var user = common.proxy.user;
var baby = common.proxy.baby;

var config = require('../config.json');
var xss = require('xss');
var _ = require('underscore');
var fs = require('fs');
var moment = require('moment');

var mod = {};
mod.api = {};
module.exports = mod;

_.extend(mod, {
    reg: function(req, res){
        res.render('reg');
    },

    login: function(req, res){
        res.render('login');
    },

    logout: function(req, res){
        req.session.destroy();
        res.redirect('/');
    },

    index: function(req, res){
        baby.getByQuery({}, {}, {sort: {hot: -1}, limit: 20}, function(err, list){

            res.render('index', {list: list});
        });
    },

    pay: function(req, res){
        res.render('pay');
    }
});

/****************** API *********************/
_.extend(mod.api, {
    /**
     * 登录
     * @param req
     * @param res
     */
    login: function(req, res){
        var o = {
            login_name: xss(req.body.login_name).trim(),
            pwd: util.md5(req.body.pwd + config.pwdSecret)
        };

        user.getByQuery({ '$or': [{login_name: o.login_name}, {name: o.login_name}] }, function(err, list){
            var user = list[0];
            if(user){
                if(o.pwd != user.pwd){
                    return res.json(util.res(-1, { msg: '用户名或密码错误。' }));
                }
            }else{
                return res.json(util.res(-1, { msg: '用户名或密码错误。' }));
            }

            user.save();

            req.session.user = user;
            res.json(util.res(0));
        });

    }
});