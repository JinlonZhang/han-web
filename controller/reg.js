/**
 * Created by 28652 on 2015/11/17.
 */
var common = require('han-common');
var util = common.lib.util;
var proxy = common.proxy;
var User = proxy.user;

var _ = require('underscore');
var async = require('async');
var xss = require('xss');
var config = require('../config');

var mod = {};
mod.api = {};
module.exports = mod;

_.extend(mod, {
    reg: function(req, res){
        res.render('reg');
    }
});


/***************** API *******************/
var api = {};
exports.api = api;

_.extend(mod.api, {
    /**
     * 注册
     * @param req
     * @param res
     */
    reg: function(req, res){

        var o = {
            login_name : xss(req.body.login_name).trim(),
            nick_name : xss(req.body.nick_name).trim(),
            pwd : req.body.pwd,
            pwd2 : req.body.pwd2,
            avatarUrl: 'http://127.0.0.1:5050/img/avatar.jpg'
        };

        var regPhone = /^1\d{10}$/;

        if(o.login_name == ''){
            return res.json( util.res(-1, {msg: '邮箱/手机不能为空。'}) )
        }
        if(o.login_name.indexOf('@') < 0 && !regPhone.test(o.login_name) ){
            return res.json( util.res(-1, {msg: '手机号码格式错误。'}) )
        }
        if(o.pwd == ''){
            return res.json( util.res(-1, {msg: '密码不能为空'}) );
        }
        if(o.pwd.length < 6){
            return res.json( util.res(-1, {msg: '密码长度必须大于等于6位'}) );
        }
        if(o.pwd != o.pwd2){
            return res.json( util.res(-1, {msg: '两次密码不一致。'}) )
        }
        o.pwd = util.md5(o.pwd + config.pwdSecret);

        var fb = [];
        _.each(fb, function(f){
            if(o.nick_name.indexOf(f) != -1){
                return res.json( util.res(-1, {msg: '昵称违规！'}) )
            }
        });

        async.auto({
            checkLoginName: function(fn){
                User.getByLoginName(o.login_name, fn);
            },
            checkName: function(fn){
                User.getByName(o.nick_name, fn);
            },
            add: ['checkLoginName', 'checkName', function(fn, data){
                if(data.checkLoginName == null && data.checkName == null){
                    User.add(o, fn);
                }else{
                    fn(null);
                }
            }]
        }, function(err, data){
            if(data.checkLoginName != null){
                return res.json( util.res(-1, {msg: '邮箱/手机已被注册！'}) );
            }
            if(data.checkName != null){
                return res.json( util.res(-1, {msg: '昵称重复！'}) );
            }
            req.session.user = data.add[0];
            res.json( util.res(err) );
        });
    }
})