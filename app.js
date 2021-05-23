// Auto generated:
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// Manual additions:
const mongoose = require('mongoose'); // https://www.npmjs.com/package/mongoose
const passport = require('passport'); // https://www.npmjs.com/package/passport
const cors = require('cors'); // https://www.npmjs.com/package/cors
const helmet = require('helmet'); // https://www.npmjs.com/package/helmet

const swaggerUi = require('swagger-ui-express'); // https://www.npmjs.com/package/swagger-ui-express
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./openapi.yaml');

const config = require('./config');

// Connnect to MongoDB:
mongoose.connect(config.mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}).then(() => {
  console.log('Connected to MongoDB');
}, (err) => {
  console.log(err);
});

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const charitiesRouter = require('./routes/charities');
const pickupRouter = require('./routes/pickups');

const app = express();

// Enable CORS for all origins:
app.use(cors());

// Enable hemet
app.use(helmet());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());

// Configure passport:
app.use(passport.initialize());

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/charities', charitiesRouter);
app.use('/pickups', pickupRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
