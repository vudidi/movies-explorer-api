const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const { BadRequestError } = require('../errors/BadRequestError');
// const { NotFoundError } = require('../errors/NotFoundError');
const { ServerError } = require('../errors/ServerError');
const { ConflictError } = require('../errors/ConflictError');

const createUser = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => {
      User.create({
        email,
        password: hash,
        name,
      })
        .then((user) => {
          res.status(201).send({
            _id: user._id,
            email: user.email,
            name: user.name,
          });
        })
        .catch((err) => {
          if (err.name === 'ValidationError') {
            const fields = Object.keys(err.errors).join(', ');
            return next(
              new BadRequestError(
                `Переданы некорректные данные при создании пользователя: ${fields}`,
              ),
            );
          }
          if (err.code === 11000) {
            return next(
              new ConflictError('Пользователь с такой почтой уже существует'),
            );
          }

          return next(new ServerError('Произошла ошибка'));
        });
    })
    .catch(next);
};

const loginUser = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch(next);
};

module.exports = {
  createUser,
  loginUser,
};
