const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const requestLanguage = require('express-request-language');
const favicon = require('serve-favicon');
const i18n = require('i18n');
const logger = require('morgan');
const path = require('path');

// Internal dependencies
const index = require('./routes/index');
const languages = require('./locales/languages');
const users = require('./routes/users');

// i18n setup
i18n.configure({
  locales: languages.getValidLanguages(),
  cookie: 'locale',
  autoReload: true,
  updateFiles: false,
  retryInDefaultLocale: true,
  directory: path.join(__dirname, '/locales')
});

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(cookieParser());
app.use(i18n.init); // Requires cookie parser!

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(requestLanguage({
  languages: ['en-US', 'ru'],
  cookie: {
    name: 'language',
    options: { maxAge: 24 * 3600 * 1000 },
    url: '/languages/{language}'
  }
}));
app.use(express.static(path.join(__dirname, '../public')));


app.use('/', (req, res, next) => {
  const locale = req.language.slice(0, 2);
  if (locale && languages.isValid(locale) && locale !== req.locale) {
    req.localeChange = { old: req.locale, new: locale };
    i18n.setLocale(req, locale);
  }
  return next();
});

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
