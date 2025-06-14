/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
if(process.env.NODE_ENV !== 'production') // Env dosyası sadece production ortamında kullanılacaksa
   require('dotenv').config(); // bu env dosyasının içeriğini yükler

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


// bu static routing işlemi

/*
var usersRouter = require('./routes/users');
var auditlogsRouter = require('./routes/auditlogs');*/

var indexRouter = require('./routes/index'); // dinamik için sadece index.js dosyasını ekliyoruz


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// dinamik routing işlemi ve api endpoint'i için indexRouter'ı kullanıyoruz
app.use('/api', indexRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
