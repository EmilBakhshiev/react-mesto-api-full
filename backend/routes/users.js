const router = require('express').Router();
const {
  getUsers,
  getUserById,
  updateProfile,
  updateAvatar,
  getMyUser,
} = require('../controllers/users');
const { validateId, validateUserInfo, validateUserAvatar } = require('../middlewares/validation');

router.get('/', getUsers);
router.get('/me', getMyUser);
router.get('/:id', validateId, getUserById);
router.patch('/me', validateUserInfo, updateProfile);
router.patch('/me/avatar', validateUserAvatar, updateAvatar);

module.exports = router;
