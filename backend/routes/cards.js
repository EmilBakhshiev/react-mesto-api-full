const express = require('express');
const router = require('express').Router();
const {
  getCards,
  createCard,
  deleteCard,
  likeCards,
  dislikeCard,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', express.json(), createCard);
router.delete('/:cardId', deleteCard);
router.put('/:cardId/likes', likeCards);
router.delete('/:cardId/likes', dislikeCard);

module.exports = router;
