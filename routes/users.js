const router = require('express').Router();
// const { celebrate, Joi } = require('celebrate');
// const { validateURL } = require('../utils/JoiCustomValidator');
// const auth = require('../middlewares/auth');
const {
  createUser,
  loginUser,
} = require('../controllers/users');

router.post('/signup', createUser);
router.post('/signin', loginUser);

module.exports = router;
