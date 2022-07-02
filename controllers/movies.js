const Movie = require('../models/movies');
const { BadRequestError } = require('../errors/BadRequestError');
const { NotFoundError } = require('../errors/NotFoundError');
const { ServerError } = require('../errors/ServerError');
const { ForbiddenError } = require('../errors/ForbiddenError');

const getMovies = (req, res, next) => {
  const owner = req.user._id;

  Movie.find({ owner })
    .then((movies) => {
      res.status(201).send({ movies });
    })
    .catch(() => {
      next(new ServerError('Произошла ошибка'));
    });
};

const addMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  const owner = req.user._id;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    owner,
    movieId,
    nameRU,
    nameEN,
  })
    .then((movie) => {
      res.status(201).send({ movie });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const fields = Object.keys(err.errors).join(', ');
        return next(
          new BadRequestError(
            `Переданы некорректные данные при создании карточки: ${fields}`,
          ),
        );
      }
      return next(new ServerError('Произошла ошибка'));
    });
};

const removeMovie = (req, res, next) => {
  Movie.findById(req.params._id)
    .then((item) => {
      if (!item) {
        return next(new NotFoundError('Фильм с указанным id не найден.'));
      }
      if (item.owner.toString() !== req.user._id) {
        return next(new ForbiddenError('Нет доступа к удалению фильма'));
      }
      return item.remove(req.params._id).then(() => {
        res.status(200).send({ message: 'Фильм удален из избранного.' });
      });
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        return next(new BadRequestError('Некорректный id фильма'));
      }
      return next(new ServerError('Произошла ошибка'));
    });
};

module.exports = {
  getMovies,
  addMovie,
  removeMovie,
};
