const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const AuthError = require('../errors/AuthError');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const DuplicateError = require('../errors/DuplicateError');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      if (users.length >= 1) {
        res.send(users);
      } else {
        throw new NotFoundError('Пользователи не найдены');
      }
    })
    .catch(() => res.status(500).send({ message: 'Произошла ошибка сервера' }));
};

const getMyUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new Error('Нет пользователя с таким id'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new ValidationError('Id неверный');
      }
      throw new NotFoundError(err.message);
    })
    .catch(next);
};

const getUserById = (req, res, next) => {
  User.findById(req.params.id)
    .orFail(new Error('Нет пользователя с таким id'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new ValidationError('Id неверный');
      }
      throw new NotFoundError(err.message);
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;
  if (!email || !password) {
    throw new AuthError('Пароль или почта некорректны');
  }
  bcrypt.hash(password, 10).then((hash) => {
    User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    })
      .then((user) =>
        res.status(200).send({
          _id: user._id,
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          email: user.email,
        })
      )
      .catch((err) => {
        if (err.name === 'MongoError' || err.code === 11000) {
          throw new DuplicateError('Пользователь с таким email уже существует');
        } else if (err.name === 'ValidationError' || err.name === 'CastError') {
          throw new ValidationError('Пароль или почта некорректны');
        }
      })
      .catch(next);
  });
};

const updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  if (!name || !about) {
    throw new ValidationError('Введенные данные некорректны');
  }
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    }
  )
    .orFail(new Error('Нет пользователя с таким Id'))
    .then((data) => res.send(data))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        throw new ValidationError('Введенные данные некорректны');
      }
      throw new NotFoundError(err.message);
    })
    .catch(next);
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  if (!avatar) {
    throw new ValidationError('Введенные данные некорректны');
  }
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    }
  )
    .orFail(new Error('Нет пользователя с таким id'))
    .then((data) => res.send(data))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        throw new ValidationError(err.message);
      }
      throw new NotFoundError(err.message);
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'super-secret-key', {
        expiresIn: '7d',
      });
      res.send({ token });
    })
    .catch((err) => {
      throw new AuthError(err.message);
    })
    .catch(next);
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
  login,
  getMyUser,
};
