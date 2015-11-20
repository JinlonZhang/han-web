
var config = require('./config.json');
var common = require('han-common');
var commonConfig = common.config;

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var url = require('url');
var _ = require('underscore');
var moment = require('moment');
moment.locale('zh-cn');

var route = require('./route');

var app = express();

app.set('views', path.join(__dirname, 'public/page'));
app.set('view engine', 'ejs');

app.use(favicon(__dirname + '/public/img/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser(config.cookieSecret));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: config.cookieSecret,
    key: 'han_user',
    cookie: {maxAge: 1000 * 60 * 60 * 24 * 7},  //7天
    store: new MongoStore({
        host: common.config.host,
        db: common.config.dbName
    }),
    resave: true,
    saveUninitialized: true
}));

//app.set('view cache', true);

app.use(function(req, res, next){
    var o = {
        staticPath: config.staticPath + (config.staticVer != '' ? '/' + config.staticVer : ''),
        staticVer: config.staticVer,
        onLine: config.onLine,
        linkUrl: config.linkUrl,
        moment: moment,
        url: url,
        req: req
    };
    res.locals.G = o;
    res.locals._ = _;

    next();
});

route(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
