require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const { limiter } = require('./utils/rateLimiter');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { errorHandler } = require('./errors/errorHandler');
const userRouter = require('./routes/users');
const movieRouter = require('./routes/movies');
const auth = require('./middlewares/auth');
const { pageNotFound } = require('./errors/pageNotFound');

const app = express();

app.use(cors());

app.use(helmet({
  crossOriginResourcePolicy: false,
}));

app.use(limiter);

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/moviesdb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use('/', userRouter);
app.use('/', movieRouter);
app.use('*', auth, pageNotFound);

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
