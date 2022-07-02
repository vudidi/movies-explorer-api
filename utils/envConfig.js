const {
  NODE_ENV,
  ENV_PORT = 3000,
  JWT_SECRET,
  DB_URL = 'mongodb://localhost:27017/moviesdb',
} = process.env;

module.exports = {
  NODE_ENV, ENV_PORT, JWT_SECRET, DB_URL,
};
