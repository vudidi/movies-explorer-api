require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const { limiter } = require('./utils/rateLimiter');
const { ENV_PORT, DB_URL } = require('./utils/envConfig');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { errorHandler } = require('./errors/errorHandler');
const userRouter = require('./routes/users');
const movieRouter = require('./routes/movies');
const auth = require('./middlewares/auth');
const { pageNotFound } = require('./errors/pageNotFound');

const app = express();

mongoose.connect(DB_URL);

app.use(requestLogger);
app.use(limiter);
app.use(helmet({
  crossOriginResourcePolicy: false,
}));
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

app.listen(ENV_PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${ENV_PORT}`);
});
