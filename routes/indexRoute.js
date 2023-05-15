const express = require('express');

const router = express.Router();

const generateConstantData = require('../middleware/generateConstantData');
const loadNavbarData = require('../middleware/loadNavbarData');

const errorGetController = require('../controllers/index/error/get');
const indexGetController = require('../controllers/index/index/get');

router.get(
  '/',
    generateConstantData,
    loadNavbarData,
    indexGetController
);
router.get(
  '/error',
    errorGetController
);

module.exports = router;
