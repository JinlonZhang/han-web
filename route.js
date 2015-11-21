/**
 * User: 28652
 * Date: 15-7-1
 * Time: 上午8:52
 */
var common = require('han-common');
var util = common.lib.util;

var _ = require('underscore');
var con = require('./controller');
var site = con.site;
var reg = con.reg;
var luck = con.luck;
var pay = con.pay;
var user = con.user;

var auth = {};
auth.api = {};

/**
 * 用户是否登录，URL地址拦截。
 */
_.extend(auth, {
    login: function(req, res, next){
        if(req.session.user){
            next();
        }else{
            res.redirect('/');
        }
    },

    not_login: function(req, res, next){
        if(req.session.user){
            res.redirect('/');
        }else{
            next();
        }
    }
});

/**
 * 用户是否登录，API接口拦截。
 */
_.extend(auth.api, {
    login: function(req, res, next){
        if(req.session.user){
            next();
        }else{
            return res.json( util.res(-100, {msg: '请重新登录。'}) );
        }
    },

    not_login: function(req, res, next){
        if(req.session.user){
            return res.json( util.res(-100, {msg: '请重新登录。'}) );
        }else{
            next();
        }
    }
})

module.exports = function(app){

    app.get('/', site.index);
    app.get('/login', auth.not_login, site.login);
    app.get('/reg', auth.not_login, site.reg);
    app.get('/logout', site.logout);
    app.get('/pay', pay.index);

    app.get('/user/:id', user.baseInfo, user.index);
    app.get('/user/:id/luck', user.baseInfo, user.luck);
    app.get('/user/:id/win', user.baseInfo, user.win);

    app.post('/api/login', site.api.login);
    app.post('/api/reg', reg.api.reg);

    app.post('/api/luck', auth.login, luck.api.add);
    app.post('/api/pay', auth.login, pay.api.add);



    /**
     * get      /api/user 获取列表
     * post     /api/user 新增 or 编辑
     * delete   /api/user 删除1个 or 批量删除
     *
     * get      /api/user/A 获取A用户的详情
     *
     * get      /api/user/A/follow 获取A用户的关注列表
     * post     /api/user/A/follow 关注A用户
     */
}