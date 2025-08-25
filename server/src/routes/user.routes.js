const router = require('express').Router();
const auth = require('../middleware/auth');
const { list } = require('../controllers/user.controller');

router.get('/', auth, list);

module.exports = router;
