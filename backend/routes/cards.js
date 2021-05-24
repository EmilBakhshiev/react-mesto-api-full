const router = require('express').Router();
const {
  getCards,
  createCard,
  deleteCard,
  likeCards,
  dislikeCard,
} = require('../controllers/cards');
const { validateCardId, validateCard } = require('../middlewares/validation');

router.get('/', getCards);
router.post('/', validateCard, createCard);
router.delete('/:cardId', validateCardId, deleteCard);
router.put('/:cardId/likes', validateCardId, likeCards);
router.delete('/:cardId/likes', validateCardId, dislikeCard);

module.exports = router;
