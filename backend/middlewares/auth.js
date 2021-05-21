const jwt = require('jsonwebtoken');
const AuthError = require('../errors/AuthError');

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  let payload;
  try {
    if (!authorization || !authorization.startsWith('Bearer')) {
      throw new AuthError('Необходима авторизация');
    }

    const token = authorization.replace('Bearer ', '');

    payload = jwt.verify(token, 'super-secret-key');
  } catch (err) {
    next(new AuthError('Необходима авторизация'));
  }

  req.user = payload;
  return next();
};

module.exports = auth;
