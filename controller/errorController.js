const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldDB = (err) => {
  const value = err.keyValue;
  const message = `Duplicate field value: ${value.name},Please use another value!`;
  return new AppError(message, 400);
};

const handleValidatorErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  // console.log(message);
  return new AppError(message, 400);
  // const value = err.keyValue;
  // const message = `Duplicate field value: ${value.name},Please use another value!`;
  // return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    err: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  //Operational, trusted error : send message to cliebnt
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.log('ERROR 🪩', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!',
    });
  }
};

const handleJWTError = () =>
  new AppError('Invalid token. Please login again', 401);

const handleExpiresError = () =>
  new AppError('Your token has expires! Please login again', 401);
//Programing or other unknown error: don't leak error details
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    let error = { ...err };
    // const a = error.errors.name.split(':')[0];
    // console.log(error);
    if (error.path === '_id') error = handleCastErrorDB(error);
    if (error.code === 11000) {
      error = handleDuplicateFieldDB(error);
    }
    if (err.name === 'ValidationError') {
      error = handleValidatorErrorDB(error);
    }

    if (error.name === 'JsonWebTokenError') {
      error = handleJWTError();
    }

    if (error.name === 'TokenExpiredError') {
      error = handleExpiresError();
    }

    sendErrorProd(error, res);
  }
};
