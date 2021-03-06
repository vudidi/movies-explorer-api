const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');
const { emailRegex } = require('../utils/regEx');
const {
  createUser,
  loginUser,
  getUser,
  updateUserInfo,
} = require('../controllers/users');

router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().pattern(emailRegex),
    password: Joi.string().required(),
    name: Joi.string().required().min(2).max(30),
  }),
}), createUser);

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().pattern(emailRegex),
    password: Joi.string().required(),
  }),
}), loginUser);

router.get('/users/me', auth, getUser);

router.patch(
  '/users/me',
  auth,
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().pattern(emailRegex),
      name: Joi.string().required().min(2).max(30),
    }),
  }),
  updateUserInfo,
);

module.exports = router;
