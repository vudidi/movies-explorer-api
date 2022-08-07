const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // за 15 минут
  max: 10000, // можно совершить максимум 10000 запросов с одного IP
});

module.exports = {
  limiter,
};
