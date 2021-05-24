const Card = require('../models/card');
const ValidationError = require('../errors/ValidationError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(next);
};

const createCard = (req, res, next) => {
  const owner = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((err) => {
      throw new ValidationError('Неверные данные');
    })
    .catch(next);
};

const deleteCard = (req, res, next) => {
  const userId = req.user._id;
  Card.findById(req.params.cardId)
    .orFail(new Error('Карточки не существует'))
    .then((card) => {
      if (card.owner.toString() !== userId) {
        throw new ForbiddenError(
          'Действие недоступно. Вы не являетесь владельцем карточки',
        );
      }
      Card.findByIdAndDelete(req.params.cardId)
        .then((data) => res.send({ message: 'Карточка удалена' }))
        .catch(next);
    })
    .catch((err) => {
      throw new ValidationError(err.message);
    })
    .catch(next);
};

const likeCards = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .orFail(new Error('Карточки с таким id не существует'))
    .then((likeCard) => res.send(likeCard))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new ValidationError('Id неверный');
      }
      throw new NotFoundError(err.message);
    })
    .catch(next);
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .orFail(new Error('Карточки с таким id не существует'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new ValidationError('Id неверный');
      }
      throw new NotFoundError(err.message);
    })
    .catch(next);
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCards,
  dislikeCard,
};
