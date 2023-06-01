const express = require('express');

const router = express.Router();

const generateConstantData = require('../middleware/generateConstantData');
const loadNavbarData = require('../middleware/loadNavbarData');

const indexGetController = require('../controllers/blog/get');

router.get(
  '/*',
    generateConstantData,
    loadNavbarData,
    indexGetController
);

module.exports = router;
