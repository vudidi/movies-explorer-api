const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { validateURL } = require('../utils/JoiCustomValidator');
const auth = require('../middlewares/auth');
const { getMovies, addMovie, removeMovie } = require('../controllers/movies');

router.get('/movies', auth, getMovies);

router.post('/movies', auth, celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom(validateURL, 'custom validation'),
    trailerLink: Joi.string().required().custom(validateURL, 'custom validation'),
    thumbnail: Joi.string().required().custom(validateURL, 'custom validation'),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), addMovie);

router.delete('/movies/:_id', auth, celebrate({
  params: Joi.object().keys({
    _id: Joi.string().hex().length(24),
  }),
}), removeMovie);

module.exports = router;
